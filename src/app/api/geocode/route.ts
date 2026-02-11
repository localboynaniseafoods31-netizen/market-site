import { NextRequest, NextResponse } from 'next/server';

interface NominatimResponse {
    address?: {
        postcode?: string;
        suburb?: string;
        neighbourhood?: string;
        city?: string;
        town?: string;
        village?: string;
        state?: string;
        country?: string;
    };
    display_name?: string;
}

export interface GeocodeResult {
    pincode: string | null;
    locality: string;
    city: string;
    state: string;
    displayName: string;
}

/**
 * GET /api/geocode?lat=12.9716&lng=77.5946
 * 
 * Reverse geocodes coordinates to address using OpenStreetMap Nominatim (free)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');

        if (!lat || !lng) {
            return NextResponse.json(
                { error: 'Missing lat or lng parameter' },
                { status: 400 }
            );
        }

        // Validate coordinates
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        if (isNaN(latitude) || isNaN(longitude)) {
            return NextResponse.json(
                { error: 'Invalid coordinates' },
                { status: 400 }
            );
        }

        // Try BigDataCloud first, then Nominatim as fallback (better for India pincodes)
        let pincode = '';
        let locality = '';
        let city = '';
        let state = '';
        let displayName = '';

        const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
        try {
            const response = await fetch(bdcUrl, {
                next: { revalidate: 3600 },
                headers: { 'Accept': 'application/json' },
            });
            if (response.ok) {
                const data = await response.json();
                pincode = data.postcode || '';
                locality = data.locality || data.principalSubdivision || '';
                city = data.city || data.locality || '';
                state = data.principalSubdivision || '';
                displayName = [locality, city].filter(Boolean).join(', ');
            }
        } catch (e) {
            console.warn('BigDataCloud geocode failed, trying Nominatim', e);
        }

        // Fallback: Nominatim reverse (reliable for India, used by location search)
        if (!pincode || !locality) {
            const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
            const nomRes = await fetch(nominatimUrl, {
                headers: {
                    'User-Agent': 'Localboynaniseafoods/1.0 (delivery location)',
                    'Accept-Language': 'en',
                },
                next: { revalidate: 3600 },
            });
            if (nomRes.ok) {
                const nomData = await nomRes.json();
                const addr = nomData?.address || {};
                pincode = pincode || addr.postcode || addr.pincode || '';
                locality = locality || addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.city_district || '';
                city = city || addr.city || addr.town || addr.village || addr.state_district || '';
                state = state || addr.state || '';
                if (!displayName) displayName = [locality, city].filter(Boolean).join(', ') || nomData?.display_name || '';
            }
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
