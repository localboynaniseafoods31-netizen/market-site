import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit';

interface NominatimResponse {
    address?: {
        postcode?: string;
        pincode?: string;
        suburb?: string;
        neighbourhood?: string;
        city_district?: string;
        state_district?: string;
        city?: string;
        town?: string;
        village?: string;
        state?: string;
        country?: string;
        country_code?: string;
    };
    display_name?: string;
}

interface BigDataCloudResponse {
    postcode?: string;
    locality?: string;
    city?: string;
    principalSubdivision?: string;
    countryCode?: string;
}

export interface GeocodeResult {
    pincode: string | null;
    locality: string;
    city: string;
    state: string;
    displayName: string;
}

const extractIndianPincode = (value: unknown): string | null => {
    if (typeof value !== 'string') return null;
    const match = value.match(/\b\d{6}\b/);
    return match ? match[0] : null;
};

const parseCoordinate = (value: string | null, min: number, max: number): number | null => {
    if (!value) return null;
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < min || parsed > max) return null;
    return parsed;
};

/**
 * GET /api/geocode?lat=12.9716&lng=77.5946
 * 
 * Reverse geocodes coordinates to address using OpenStreetMap Nominatim (free)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const rateLimit = checkRateLimit(request, {
            key: 'location:geocode',
            limit: 30,
            windowMs: 60_000
        });
        if (!rateLimit.allowed) return rateLimitExceededResponse(rateLimit);

        const { searchParams } = new URL(request.url);
        const lat = parseCoordinate(searchParams.get('lat'), -90, 90);
        const lng = parseCoordinate(searchParams.get('lng'), -180, 180);

        if (lat === null || lng === null) {
            return NextResponse.json(
                { error: 'Invalid lat or lng parameter' },
                { status: 400 }
            );
        }

        // Try BigDataCloud first, then Nominatim as fallback (better for India pincodes)
        let pincode = '';
        let locality = '';
        let city = '';
        let state = '';
        let displayName = '';
        let isIndia = false;

        const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
        try {
            const response = await fetch(bdcUrl, {
                next: { revalidate: 3600 },
                headers: { 'Accept': 'application/json' },
            });
            if (response.ok) {
                const data = await response.json() as BigDataCloudResponse;
                pincode = extractIndianPincode(data.postcode) || '';
                locality = data.locality || data.principalSubdivision || '';
                city = data.city || data.locality || '';
                state = data.principalSubdivision || '';
                displayName = [locality, city].filter(Boolean).join(', ');
                isIndia = data.countryCode === 'IN';
            }
        } catch (e) {
            console.warn('BigDataCloud geocode failed, trying Nominatim', e);
        }

        // Fallback: Nominatim reverse (reliable for India, used by location search)
        if (!pincode || !locality) {
            const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
            const nomRes = await fetch(nominatimUrl, {
                headers: {
                    'User-Agent': 'Localboynaniseafoods/1.0 (delivery location)',
                    'Accept-Language': 'en',
                },
                next: { revalidate: 3600 },
            });
            if (nomRes.ok) {
                const nomData = await nomRes.json() as NominatimResponse;
                const addr = nomData?.address || {};
                pincode = pincode || extractIndianPincode(addr.postcode) || extractIndianPincode(addr.pincode) || '';
                locality = locality || addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.city_district || '';
                city = city || addr.city || addr.town || addr.village || addr.state_district || '';
                state = state || addr.state || '';
                isIndia = isIndia || addr.country_code === 'in';
                if (!displayName) displayName = [locality, city].filter(Boolean).join(', ') || nomData?.display_name || '';
            }
        }

        if (!isIndia) {
            return NextResponse.json(
                { error: 'Location outside India is not supported.' },
                { status: 422 }
            );
        }

        if (!pincode) {
            return NextResponse.json(
                { error: 'Could not determine pincode for this location. Try selecting a different area or enter pincode manually.' },
                { status: 422 }
            );
        }

        const result: GeocodeResult = {
            pincode,
            locality: (locality || 'Unknown').slice(0, 30),
            city: city || '',
            state: state || '',
            displayName: displayName || locality || city || 'Unknown',
        };

        return NextResponse.json(result);

    } catch (error) {
        console.error('Geocode error:', error);
        return NextResponse.json(
            { error: 'Failed to geocode location' },
            { status: 500 }
        );
    }
}
