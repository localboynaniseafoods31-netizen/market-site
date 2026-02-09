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

        // Call Nominatim API (OpenStreetMap - free, requires User-Agent)
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;

        const response = await fetch(nominatimUrl, {
            headers: {
                'User-Agent': 'Localboynaniseafoods/1.0 (hello@localboynaniseafoods.com)',
                'Accept-Language': 'en',
            },
            // Cache for 1 hour
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            console.error('Nominatim API error:', response.status);
            return NextResponse.json(
                { error: 'Geocoding service unavailable' },
                { status: 503 }
            );
        }

        const data: NominatimResponse = await response.json();

        if (!data.address) {
            return NextResponse.json(
                { error: 'Location not found' },
                { status: 404 }
            );
        }

        const { address } = data;

        // Extract information
        const pincode = address.postcode || null;
        const locality = address.suburb || address.neighbourhood || address.village || '';
        const city = address.city || address.town || address.village || '';
        const state = address.state || '';
        const displayName = data.display_name || `${locality}, ${city}`;

        const result: GeocodeResult = {
            pincode,
            locality: locality.slice(0, 30), // Truncate for display
            city,
            state,
            displayName: displayName.split(',').slice(0, 3).join(', '), // First 3 parts only
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
