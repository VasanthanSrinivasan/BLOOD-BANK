export const sampleDonors = [
 { _id:'demo-d1', donorId:'DNR-1001', name:'Arun Kumar', email:'arun@example.com', phone:'9876543210', bloodGroup:'O+', age:28, city:'Chennai', lastDonationDate:'2026-06-12', availability:'Available' },
 { _id:'demo-d2', donorId:'DNR-1002', name:'Priya S', email:'priya@example.com', phone:'9876501234', bloodGroup:'A+', age:25, city:'Coimbatore', lastDonationDate:'2026-04-08', availability:'Available' },
 { _id:'demo-d3', donorId:'DNR-1003', name:'Mohammed Rahim', email:'rahim@example.com', phone:'9840012345', bloodGroup:'B+', age:34, city:'Salem', lastDonationDate:'2025-12-21', availability:'Unavailable' },
 { _id:'demo-d4', donorId:'DNR-1004', name:'Divya R', email:'divya@example.com', phone:'9791012345', bloodGroup:'AB+', age:29, city:'Erode', lastDonationDate:'2026-02-15', availability:'Available' },
 { _id:'demo-d5', donorId:'DNR-1005', name:'Karthik M', email:'karthik@example.com', phone:'9444012345', bloodGroup:'O-', age:31, city:'Tiruppur', lastDonationDate:'2026-05-02', availability:'Available' },
 { _id:'demo-d6', donorId:'DNR-1006', name:'Meena Lakshmi', email:'meena@example.com', phone:'9884012345', bloodGroup:'B-', age:23, city:'Madurai', lastDonationDate:'', availability:'Unavailable' },
];
export const sampleInventory = [
 {id:'INV-01', group:'A+', units:24, minimum:10, updated:'2026-10-27'}, {id:'INV-02',group:'A-',units:8,minimum:10,updated:'2026-10-27'},
 {id:'INV-03',group:'B+',units:18,minimum:10,updated:'2026-10-26'}, {id:'INV-04',group:'B-',units:6,minimum:8,updated:'2026-10-26'},
 {id:'INV-05',group:'AB+',units:12,minimum:6,updated:'2026-10-25'}, {id:'INV-06',group:'AB-',units:4,minimum:5,updated:'2026-10-25'},
 {id:'INV-07',group:'O+',units:32,minimum:12,updated:'2026-10-27'}, {id:'INV-08',group:'O-',units:7,minimum:10,updated:'2026-10-27'}
];
export const sampleHospitals = [
 {id:'HSP-101',name:'Government General Hospital',city:'Chennai',contact:'044-25305000',email:'contact@ggh.example',status:'Active'},
 {id:'HSP-102',name:'KMCH Hospital',city:'Coimbatore',contact:'0422-4323800',email:'help@kmch.example',status:'Active'},
 {id:'HSP-103',name:'City Care Medical Centre',city:'Salem',contact:'0427-2345678',email:'care@citycare.example',status:'Active'},
 {id:'HSP-104',name:'Sunrise Multispeciality',city:'Madurai',contact:'0452-2678900',email:'info@sunrise.example',status:'Pending'}
];
export const sampleRequests = [
 {id:'REQ-2001',patient:'R. Suresh',hospital:'Government General Hospital',group:'O-',units:2,priority:'Critical',status:'Pending',date:'2026-10-28'},
 {id:'REQ-2002',patient:'Anitha P',hospital:'KMCH Hospital',group:'A+',units:1,priority:'High',status:'Approved',date:'2026-10-27'},
 {id:'REQ-2003',patient:'M. Joseph',hospital:'City Care Medical Centre',group:'B+',units:3,priority:'Normal',status:'Completed',date:'2026-10-25'},
 {id:'REQ-2004',patient:'Kavitha S',hospital:'Sunrise Multispeciality',group:'AB+',units:1,priority:'High',status:'Pending',date:'2026-10-28'},
 {id:'REQ-2005',patient:'Naveen K',hospital:'KMCH Hospital',group:'O+',units:2,priority:'Normal',status:'Rejected',date:'2026-10-23'}
];
export const sampleUsers = [
 {id:'USR-001',name:'LifeLine Admin',email:'admin@lifeline.com',role:'Admin',status:'Active'},
 {id:'USR-002',name:'Dr. Nandhini',email:'nandhini@example.com',role:'Doctor',status:'Active'},
 {id:'USR-003',name:'KMCH Blood Desk',email:'blooddesk@example.com',role:'Hospital',status:'Active'},
 {id:'USR-004',name:'Demo Patient',email:'patient@example.com',role:'Patient',status:'Inactive'}
];
