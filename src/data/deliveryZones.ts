/**
 * Delivery Zones Configuration
 * Based on shipping data - pincodes, minimum orders, and ETAs
 */

export interface DeliveryZone {
    pincode: string;
    locality: string;
    state: 'AP' | 'TG' | 'KA' | 'OR' | 'TN';
    minOrder: number; // in rupees
    eta: string;
    charge: number; // delivery charge
}

// All serviceable pincodes
export const DELIVERY_ZONES: DeliveryZone[] = [
    // ==================== ANDHRA PRADESH ====================
    // Visakhapatnam region (Premium - ₹250 min)
    { pincode: '530001', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530002', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530003', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530004', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530005', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530006', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530007', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530008', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530009', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530010', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530011', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530012', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530013', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530014', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530015', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530016', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530017', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530018', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530020', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530022', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530024', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530026', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530027', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530028', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530029', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530031', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530032', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530035', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530040', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530041', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530043', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530044', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530045', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530046', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530047', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530048', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530051', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530052', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530053', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },
    { pincode: '530055', locality: 'Visakhapatnam', state: 'AP', minOrder: 250, eta: '12-18 hrs', charge: 0 },

    // Vizag surrounding (₹350 min)
    { pincode: '531036', locality: 'Chodavaram', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '531055', locality: 'Yellamanchili', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '531001', locality: 'Anakapalli', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '531116', locality: 'Narsipatnam', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '531151', locality: 'Araku', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '531105', locality: 'Sileru', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '531111', locality: 'Chintapalli', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '531024', locality: 'Paderu', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '531030', locality: 'Deverapalli', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },

    // Vizianagaram & Srikakulam (₹350 min)
    { pincode: '535001', locality: 'Vizianagaram', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '532001', locality: 'Srikakulam', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '532221', locality: 'Palasa', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '532284', locality: 'Sompeta', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '532312', locality: 'Ichapuram', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '535558', locality: 'Bobili', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '535591', locality: 'Saluru', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '535579', locality: 'Ramabadrapuram', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '535523', locality: 'Gummalaxmipuram', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '535501', locality: 'Paravathipuram', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '532127', locality: 'Rajam', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '532440', locality: 'Palakonda', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '535128', locality: 'Cheepurapalli', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '532421', locality: 'Narasannapeta', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '532201', locality: 'Tekkali', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },
    { pincode: '535145', locality: 'Skota', state: 'AP', minOrder: 350, eta: '12-18 hrs', charge: 0 },

    // East Godavari (₹400 min)
    { pincode: '533401', locality: 'Tuni', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '533406', locality: 'Annavaram', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '533001', locality: 'Kakinada', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '533201', locality: 'Amalapuram', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '533101', locality: 'Rajamahendravaram', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '533238', locality: 'Ravulapalem', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '533255', locality: 'Ramachandrapuram', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '533242', locality: 'Razole', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '533249', locality: 'Eleswaram', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '533436', locality: 'Rajavommangi', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '533437', locality: 'Peddapuram', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '533450', locality: 'Pithapuram', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '533440', locality: 'Samarlakota', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '533464', locality: 'Yanam', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '533286', locality: 'Gokavaram', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '533288', locality: 'Rampachodavaram', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '533341', locality: 'Dwarapudi', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '533342', locality: 'Anaparthi', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '533289', locality: 'Korukonda', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },

    // West Godavari (₹400 min)
    { pincode: '534201', locality: 'Bhimavaram', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '534211', locality: 'Tanuku', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '534101', locality: 'Tadepelligudem', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '534301', locality: 'Nidadavolu', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '534350', locality: 'Kovvuru', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '534112', locality: 'Nallajerla', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '534320', locality: 'Penugonda', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '534134', locality: 'Attili', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '534447', locality: 'Jangareddygudem', state: 'AP', minOrder: 450, eta: '12-18 hrs', charge: 0 },
    { pincode: '534001', locality: 'Eluru', state: 'AP', minOrder: 450, eta: '12-18 hrs', charge: 0 },
    { pincode: '532475', locality: 'Narsapuram', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },

    // Krishna & Guntur (₹400-450 min)
    { pincode: '521301', locality: 'Gudivada', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '521001', locality: 'Machilipatnam', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '520001', locality: 'Vijayawada', state: 'AP', minOrder: 450, eta: '12-18 hrs', charge: 0 },
    { pincode: '521175', locality: 'Jaggaihpet', state: 'AP', minOrder: 450, eta: '12-18 hrs', charge: 0 },
    { pincode: '521121', locality: 'Avanigadda', state: 'AP', minOrder: 450, eta: '12-18 hrs', charge: 0 },
    { pincode: '521165', locality: 'Vuyyuru', state: 'AP', minOrder: 450, eta: '12-18 hrs', charge: 0 },
    { pincode: '521185', locality: 'Nandigama', state: 'AP', minOrder: 450, eta: '12-18 hrs', charge: 0 },
    { pincode: '521235', locality: 'Tiruvuru', state: 'AP', minOrder: 450, eta: '12-18 hrs', charge: 0 },
    { pincode: '522002', locality: 'Guntur', state: 'AP', minOrder: 450, eta: '12-18 hrs', charge: 0 },
    { pincode: '522616', locality: 'Chilakaluripeta', state: 'AP', minOrder: 450, eta: '12-18 hrs', charge: 0 },
    { pincode: '522647', locality: 'Vinukonda', state: 'AP', minOrder: 450, eta: '12-18 hrs', charge: 0 },
    { pincode: '522124', locality: 'Ponnur', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '522426', locality: 'Macherla', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '522413', locality: 'Piduguralla', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '522403', locality: 'Sattenapally', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '522101', locality: 'Bapatla', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '522265', locality: 'Repalle', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },

    // Prakasam (₹450 min)
    { pincode: '523001', locality: 'Ongole', state: 'AP', minOrder: 450, eta: '12-18 hrs', charge: 0 },
    { pincode: '523201', locality: 'Addanki', state: 'AP', minOrder: 450, eta: '12-18 hrs', charge: 0 },
    { pincode: '523212', locality: 'Medarametla', state: 'AP', minOrder: 450, eta: '12-18 hrs', charge: 0 },
    { pincode: '523105', locality: 'Kandukur', state: 'AP', minOrder: 450, eta: '12-18 hrs', charge: 0 },
    { pincode: '523226', locality: 'Chimakurthi', state: 'AP', minOrder: 450, eta: '12-18 hrs', charge: 0 },
    { pincode: '523101', locality: 'Singaraya Konda', state: 'AP', minOrder: 450, eta: '12-18 hrs', charge: 0 },
    { pincode: '523372', locality: 'Akaveedu', state: 'AP', minOrder: 400, eta: '12-18 hrs', charge: 0 },
    { pincode: '523115', locality: 'Chirala', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '523230', locality: 'Kaligiri', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },

    // Tirupati & Chittoor (₹450-500 min)
    { pincode: '517501', locality: 'Tirupathi', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '517644', locality: 'Sri Kala Hasthi', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '517001', locality: 'Chittoor', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '517425', locality: 'Kuppam', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '517408', locality: 'Palamaneru', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '517325', locality: 'Madanapally', state: 'AP', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '517247', locality: 'Punganur', state: 'AP', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '516101', locality: 'Railway Kodur', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '574201', locality: 'Puttur', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },

    // Nellore (₹450-500 min)
    { pincode: '524322', locality: 'Atmakur', state: 'AP', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '524101', locality: 'Gudur', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '524201', locality: 'Kavali', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '524226', locality: 'Udayagiri', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '524126', locality: 'Naidupet', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '524121', locality: 'Sullurupet', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '524132', locality: 'Venkatagiri', state: 'AP', minOrder: 450, eta: '18-24 hrs', charge: 0 },

    // Kurnool (₹500 min)
    { pincode: '518001', locality: 'Kurnool', state: 'AP', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '518101', locality: 'Srisailam', state: 'AP', minOrder: 450, eta: '12-18 hrs', charge: 0 },
    { pincode: '518543', locality: 'Allagadda', state: 'AP', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '518422', locality: 'Atmakur Kurnool', state: 'AP', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '518124', locality: 'Banaganapally', state: 'AP', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '518222', locality: 'Dhone', state: 'AP', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '518401', locality: 'Nandikotkur', state: 'AP', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '518501', locality: 'Nandyal', state: 'AP', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '518301', locality: 'Adoni', state: 'AP', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '518360', locality: 'Yemmiganur', state: 'AP', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '518345', locality: 'Mantralayam', state: 'AP', minOrder: 500, eta: '18-24 hrs', charge: 0 },

    // Anantapur (₹500-600 min)
    { pincode: '515001', locality: 'Anantapur', state: 'AP', minOrder: 600, eta: '18-24 hrs', charge: 0 },
    { pincode: '515801', locality: 'Guntakal', state: 'AP', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '515671', locality: 'Dharmavaram', state: 'AP', minOrder: 500, eta: '18-24 hrs', charge: 0 },

    // ==================== TELANGANA ====================
    // Hyderabad (₹450 min)
    { pincode: '500001', locality: 'Nampally', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500003', locality: 'Secunderabad', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500004', locality: 'Lakdikapool', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500012', locality: 'MGBS', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500016', locality: 'Ameerpet', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500018', locality: 'Erragadda', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500019', locality: 'Lingampally', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500027', locality: 'Chadarghat', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500032', locality: 'Gachibowli', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500035', locality: 'Kothapet', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500036', locality: 'Malakpet', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500038', locality: 'SR Nagar', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500049', locality: 'Miyapur', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500060', locality: 'Dilsukhnagar', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500070', locality: 'Vanasthalipuram', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500072', locality: 'Kukatpally', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500074', locality: 'LB Nagar', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500081', locality: 'Madhapur', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500082', locality: 'Panjagutta', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500084', locality: 'Kondapur', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500085', locality: 'KPHB', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500090', locality: 'Nizampet', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '500095', locality: 'Koti', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '501505', locality: 'Hyatnagar', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '501512', locality: 'RFC', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '502032', locality: 'BHEL', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },

    // Telangana Districts (₹450-550 min)
    { pincode: '508206', locality: 'Kodada', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '508213', locality: 'Suryapet', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '508254', locality: 'Narketpally', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '508211', locality: 'Nakrekal', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '508252', locality: 'Chowtuppal', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '506002', locality: 'Warangal', state: 'TG', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '506003', locality: 'Kazipet', state: 'TG', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '507001', locality: 'Khammam', state: 'TG', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '507111', locality: 'Bhadrachalam', state: 'TG', minOrder: 550, eta: '18-24 hrs', charge: 0 },
    { pincode: '507101', locality: 'Kothagudem', state: 'TG', minOrder: 550, eta: '18-24 hrs', charge: 0 },
    { pincode: '507303', locality: 'Sathupally', state: 'TG', minOrder: 550, eta: '18-24 hrs', charge: 0 },
    { pincode: '507301', locality: 'Aswaraopeta', state: 'TG', minOrder: 550, eta: '18-24 hrs', charge: 0 },
    { pincode: '507117', locality: 'Manuguru', state: 'TG', minOrder: 550, eta: '18-24 hrs', charge: 0 },
    { pincode: '509001', locality: 'Mahabubnagar', state: 'TG', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '508001', locality: 'Nalgonda', state: 'TG', minOrder: 550, eta: '18-24 hrs', charge: 0 },
    { pincode: '503001', locality: 'Nizamabad', state: 'TG', minOrder: 550, eta: '18-24 hrs', charge: 0 },

    // ==================== KARNATAKA ====================
    // Bangalore (₹450 min)
    { pincode: '560016', locality: 'ITI Gate', state: 'KA', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '560022', locality: 'Yeswanthpur', state: 'KA', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '560023', locality: 'Majestic', state: 'KA', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '560033', locality: 'SMVT', state: 'KA', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '560034', locality: 'Agara', state: 'KA', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '560036', locality: 'KR Puram', state: 'KA', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '560037', locality: 'Marathalli', state: 'KA', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '560068', locality: 'Silk Board', state: 'KA', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '560099', locality: 'Bommasandra', state: 'KA', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '560100', locality: 'Electronic City', state: 'KA', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '560102', locality: 'HSR Layout', state: 'KA', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '560103', locality: 'Kadubeesanahalli', state: 'KA', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '562114', locality: 'Hoskote', state: 'KA', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '563102', locality: 'Kolar', state: 'KA', minOrder: 450, eta: '18-24 hrs', charge: 0 },
    { pincode: '563131', locality: 'Mulbagal', state: 'KA', minOrder: 450, eta: '18-24 hrs', charge: 0 },

    // ==================== ORISSA ====================
    { pincode: '751002', locality: 'Bhubaneswar', state: 'OR', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '752055', locality: 'Khurda Jn', state: 'OR', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '760001', locality: 'Brahmapur', state: 'OR', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '768001', locality: 'Sambalpur', state: 'OR', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '765002', locality: 'Raygada', state: 'OR', minOrder: 500, eta: '18-24 hrs', charge: 0 },
    { pincode: '764001', locality: 'Jeypore', state: 'OR', minOrder: 500, eta: '18-24 hrs', charge: 0 },

    // ==================== TAMIL NADU ====================
    { pincode: '600003', locality: 'Chennai', state: 'TN', minOrder: 500, eta: '18-24 hrs', charge: 0 },
];

// Pincode lookup map for fast access
const pincodeMap = new Map<string, DeliveryZone>();
DELIVERY_ZONES.forEach(zone => pincodeMap.set(zone.pincode, zone));

export interface DeliveryCheckResult {
    available: boolean;
    zone?: DeliveryZone;
    message: string;
}

/**
 * Check if a pincode is serviceable
 */
export function checkDeliveryAvailability(pincode: string): DeliveryCheckResult {
    const cleanPincode = pincode.replace(/\s/g, '').slice(0, 6);

    if (cleanPincode.length !== 6 || !/^\d{6}$/.test(cleanPincode)) {
        return { available: false, message: 'Please enter a valid 6-digit pincode' };
    }

    const zone = pincodeMap.get(cleanPincode);

    if (zone) {
        return {
            available: true,
            zone,
            message: `Delivers in ${zone.eta} • Min ₹${zone.minOrder}`
        };
    }

    // Check if it's close to a serviceable area (same first 3 digits)
    const prefix = cleanPincode.slice(0, 3);
    const nearbyZone = DELIVERY_ZONES.find(z => z.pincode.startsWith(prefix));

    if (nearbyZone) {
        return {
            available: false,
            message: `Coming soon to your area! We deliver to nearby ${nearbyZone.locality}.`
        };
    }

    return {
        available: false,
        message: 'Currently not serviceable. We\'re expanding soon!'
    };
}

/**
 * Get all serviceable states
 */
export function getServiceableStates(): string[] {
    return ['Andhra Pradesh', 'Telangana', 'Karnataka', 'Orissa', 'Tamil Nadu'];
}

/**
 * Get minimum order for a pincode (returns 0 if not serviceable)
 */
export function getMinimumOrder(pincode: string): number {
    const result = checkDeliveryAvailability(pincode);
    return result.zone?.minOrder || 0;
}
