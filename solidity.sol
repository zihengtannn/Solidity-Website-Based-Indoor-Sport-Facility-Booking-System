// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract IndoorSportFacilities {
    struct Facility {
        string name;
        bool isAvailable;
        uint ratePerHour;
        address owner;
    }

    struct Booking {
        address customer;
        uint bookingID;
        string facilityName;
        uint256 dateOfBooking; // Changed from time to date
        uint totalCharge;
        string userNameCust;
        string emailAddressCust;
    }

    struct TimeSlot {
        bool isBooked;
        address bookedBy;
    }

    mapping(string => Facility) public facilities;
    mapping(address => Booking[]) public customerBookings;
    mapping(string => mapping(uint256 => TimeSlot)) public facilityTimeSlots; // Changed from uint to uint256
    string[] public facilitiesByIndex;

    address public owner = 0xb3Fe34532eFcd86702C690d762cd0aa5EC3a8E0c;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        addNewFacility("Basketball Court", 0);
        addNewFacility("Tennis Court", 1);
        addNewFacility("Swimming Pool", 1);
        addNewFacility("Gym", 0);
        addNewFacility("Soccer Field", 1);
       

        owner = msg.sender;
            bookFacility("Basketball Court", 123456, "Test User", "test@example.com");
            bookFacility("Basketball Court", 123956, "Test User", "test@example.com");
            bookFacility("Basketball Court", 123256, "Test User", "test@example.com");
    }

//------------------------------Owner Sections-----------------------------------------------------------------
    function getAllFacilityNames() public view returns (string[] memory) {
        return facilitiesByIndex;
    }

    function getFacilityPrice(string memory facilityName) public view returns (uint256) {
        require(facilityExists(facilityName), "Facility not found");
        return facilities[facilityName].ratePerHour;
    }


    function getNumberOfFacilities() public view returns (uint) {
        return facilitiesByIndex.length;
    }

    function addNewFacility(string memory facilityName, uint256 price) public onlyOwner {
        require(bytes(facilityName).length > 0, "Facility name cannot be empty");
        //require(price > 0, "Price must be greater than 0");
        require(!facilityExists(facilityName), "Facility with the same name already exists");

        facilities[facilityName] = Facility(facilityName, true, price, msg.sender);
        facilitiesByIndex.push(facilityName);
    }

    function viewAllCustomerBookings() public view returns (Booking[] memory) {
        return customerBookings[msg.sender];
    }

    function bookingsCount(address customer) public view returns (uint) {
        return customerBookings[customer].length;
    }

    function removeCustomerBooking(uint bookingId) public {
    Booking[] storage customerBookingList = customerBookings[msg.sender];

    for (uint i = 0; i < customerBookingList.length; i++) {
        if (customerBookingList[i].bookingID == bookingId) {
            Booking memory booking = customerBookingList[i];
            require(address(this).balance >= booking.totalCharge, "Insufficient contract balance for refund");

            // Transfer the funds from the contract to the owner's wallet
            payable(owner).transfer(booking.totalCharge);

            // Update facility availability
            facilities[booking.facilityName].isAvailable = true;

            // Unmark the booked time slots for the facility
            facilityTimeSlots[booking.facilityName][booking.dateOfBooking] = TimeSlot(false, address(0));

            // Remove the booking record by shifting elements
            for (uint j = i; j < customerBookingList.length - 1; j++) {
                customerBookingList[j] = customerBookingList[j + 1];
            }
            
            // Reduce the array size
            customerBookingList.pop();
            
            break;
        }
    }
}



    function removeFacility(string memory facilityName) public onlyOwner {
        require(facilityExists(facilityName), "Facility not found");
        delete facilities[facilityName];

        for (uint i = 0; i < facilitiesByIndex.length; i++) {
            if (keccak256(abi.encodePacked(facilitiesByIndex[i])) == keccak256(abi.encodePacked(facilityName))) {
                for (uint j = i; j < facilitiesByIndex.length - 1; j++) {
                    facilitiesByIndex[j] = facilitiesByIndex[j + 1];
                }
                facilitiesByIndex.pop();
                break;
            }
        }
    }

    function updateFacilityPrice(string memory facilityName, uint price) public onlyOwner {
        facilities[facilityName].ratePerHour = price;
    }

    function withdrawEther(address payable receiver, uint256 amount) public onlyOwner {
        require(address(this).balance >= amount, "Insufficient contract balance");
        receiver.transfer(amount);
    }

    
    function facilityExistsInIndex(string memory facilityName) internal view returns (bool) {
        for (uint i = 0; i < facilitiesByIndex.length; i++) {
            if (keccak256(abi.encodePacked(facilitiesByIndex[i])) == keccak256(abi.encodePacked(facilityName))) {
                return true;
            }
        }
        return false;
    }
//-----------------------------Customer Section------------------------------------------------------------------
    function bookFacility(string memory facilityName, uint dateOfBooking, string memory userName, string memory emailAddress) public payable {
    require(isDateAvailable(facilityName, dateOfBooking), "Facility is fully booked for the selected date");
    require(msg.value >= facilities[facilityName].ratePerHour, "Insufficient funds");

    uint bookingId = uint(keccak256(abi.encodePacked( facilityName, dateOfBooking)));
    Booking memory newBooking = Booking(msg.sender, bookingId, facilityName, dateOfBooking, msg.value, userName, emailAddress);

    // Transfer the funds to the owner's wallet
    payable(owner).transfer(msg.value);

    facilities[facilityName].isAvailable = false;
    customerBookings[msg.sender].push(newBooking);
    facilityTimeSlots[facilityName][dateOfBooking] = TimeSlot(true, msg.sender);

    if (!facilityExistsInIndex(facilityName)) {
        facilitiesByIndex.push(facilityName);
    }
}


    function isDateAvailable(string memory facilityName, uint256 dateOfBooking) internal view returns (bool) {
        return !facilityTimeSlots[facilityName][dateOfBooking].isBooked;
    }

    function getFacilityRate(string memory facilityName) public view returns (uint256) {
        return facilities[facilityName].ratePerHour;
    }

    function viewFacility(string memory facilityName) public view returns (string memory, bool, uint) {
        Facility memory facility = facilities[facilityName];
        require(bytes(facility.name).length > 0, "Facility not found");
        return (facilityName, facility.isAvailable, facility.ratePerHour);
    }

    function checkFacilityAvailability(string memory facilityName, uint256 dateOfBooking) public view returns (bool) {
        return !facilityTimeSlots[facilityName][dateOfBooking].isBooked;
    }

    function facilityExists(string memory facilityName) internal view returns (bool) {
        return bytes(facilities[facilityName].name).length > 0;
    }

    receive() external payable {
        // Implement fallback logic if needed
    }
}
