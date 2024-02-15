document.addEventListener('DOMContentLoaded', async () => {
    // Connect to the Ethereum network using Web3.js
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.enable();
			window.web3.eth.defaultAccount = window.ethereum.selectedAddress;
        } catch (error) {
            console.error("User denied account access");
        }
    } else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.error("No Ethereum provider detected. You should consider installing MetaMask.");
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const bookingDateInput = document.getElementById('bookingDate');

    // Set the min attribute to the current date
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.min = today;

    // Add an event listener to check the selected date
    bookingDateInput.addEventListener('input', () => {
        const selectedDate = new Date(bookingDateInput.value);
        const currentDate = new Date();

        // Disable the date input if the selected date is in the past
        if (selectedDate < currentDate) {
            bookingDateInput.setCustomValidity('Please select a future date.');
        } else {
            bookingDateInput.setCustomValidity('');
        }
    });
});



document.addEventListener("DOMContentLoaded", async () => {
	// Populate facility options when the page is loaded
	await populateFacilityOptions('facilitySelect');
	await populateFacilityOptions('facilityNameToRemove');
	await populateFacilityOptions('facilityNameToUpdate');
	
});


const contractABI =[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "facilityName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "addNewFacility",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "facilityName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "dateOfBooking",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "userName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "emailAddress",
				"type": "string"
			}
		],
		"name": "bookFacility",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "customer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "facilityName",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "dateOfBooking",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalCharge",
				"type": "uint256"
			}
		],
		"name": "BookingMade",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "customer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "facilityName",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "dateOfBooking",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalCharge",
				"type": "uint256"
			}
		],
		"name": "BookingRemoved",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "facilityName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "dateOfBooking",
				"type": "uint256"
			}
		],
		"name": "removeBooking",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "facilityName",
				"type": "string"
			}
		],
		"name": "removeFacility",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "facilityName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "updateFacilityPrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "facilityName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "dateOfBooking",
				"type": "uint256"
			}
		],
		"name": "checkFacilityAvailability",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "customerBookings",
		"outputs": [
			{
				"internalType": "address",
				"name": "customer",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "facilityName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "dateOfBooking",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalCharge",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "userNameCust",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "emailAddressCust",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "facilities",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isAvailable",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "ratePerDay",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "facilitiesByIndex",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "facilityBookings",
		"outputs": [
			{
				"internalType": "address",
				"name": "customer",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "facilityName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "dateOfBooking",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalCharge",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "userNameCust",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "emailAddressCust",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "facilityTimeSlots",
		"outputs": [
			{
				"internalType": "bool",
				"name": "isBooked",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "bookedBy",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllFacilityNames",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "facilityName",
				"type": "string"
			}
		],
		"name": "getFacilityPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOwnerWalletAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "dateOfBooking",
				"type": "uint256"
			}
		],
		"name": "viewBookingsByDate",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "customer",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "facilityName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "dateOfBooking",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalCharge",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "userNameCust",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "emailAddressCust",
						"type": "string"
					}
				],
				"internalType": "struct IndoorSportFacilitiesBookingSystem.Booking[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "viewCustomerBookings",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "customer",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "facilityName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "dateOfBooking",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalCharge",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "userNameCust",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "emailAddressCust",
						"type": "string"
					}
				],
				"internalType": "struct IndoorSportFacilitiesBookingSystem.Booking[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const contractAddress = '0x9Fa32E06aFBaED10B07C1C7c2653205E26793766';

const contract = new window.web3.eth.Contract(contractABI, contractAddress);

async function checkWallet() {
    const contract = new window.web3.eth.Contract(contractABI, contractAddress);

    try {
        // Check if MetaMask is installed
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);

            try {
                // Request account access if needed
                await window.ethereum.enable();
                window.web3.eth.defaultAccount = window.ethereum.selectedAddress;

                // Get the current account address
                const currentAddress = window.web3.eth.defaultAccount;

                // Get the owner's wallet address from the contract
                const result = await contract.methods.getOwnerWalletAddress().call();

                // Check if the current address is authorized
                if (currentAddress.toLowerCase() !== result.toLowerCase()) {
                    alert('Unauthorized access. Please use the authorized wallet.');
                } else {
                    // Redirect to owner.html
                    window.location.href = 'owner.html';
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            // MetaMask not installed, handle accordingly
            console.error('MetaMask not installed');
        }
    } catch (error) {
        console.error('Error calling getOwnerWalletAddress', error);
    }
}


async function addNewFacility() {
    const contract = new window.web3.eth.Contract(contractABI, contractAddress);
    try {
        // Replace these lines with your form input values
		const facilityName = document.getElementById('facilityName').value;
		const facilityPrice = document.getElementById('facilityPrice').value;

        // Use contract.methods.addNewFacility() to call the function
		await contract.methods.addNewFacility(facilityName, facilityPrice).send({ from: window.web3.eth.defaultAccount });


        // Display the result
        const addNewFacilityResultElement = document.getElementById('addNewFacilityResult');
        addNewFacilityResultElement.innerHTML = `<p>New Facility Added: ${facilityName}</p>`;

        console.error('Add Successfully');
    } catch (error) {
        console.error('Error calling addNewFacility:', error);
    }
}

async function viewAllCustomerBookings() {
    const contract = new window.web3.eth.Contract(contractABI, contractAddress);

    try {
        // Use contract.methods.viewAllCustomerBookings() to call the function
        const result = await contract.methods.viewAllCustomerBookings().call();

        // Log the result to the console for debugging
        console.log("All Customer Bookings Result:", result);
        // Display the result
        const allCustomerBookingsResultElement = document.getElementById('allCustomerBookingsResult');

        // Check if the HTML element exists
        if (!allCustomerBookingsResultElement) {
            console.error('HTML element not found: allCustomerBookingsResult');
            return;
        }

        allCustomerBookingsResultElement.innerHTML = `<h2>All Bookings</h2>`;
        result.forEach((booking, index) => {
            // You may want to format the date for better readability
            const dateValue = booking.dateOfBooking; // replace this with your actual dateOfBooking value
			// Extract day, month, and year values
			const day = dateValue.slice(0, 1);
			const month = dateValue.slice(1, 3);
			const year = dateValue.slice(3);
			
			// Format the date as D/MM/YY
			const formattedDate = `${day}/${month}/${year}`;



            allCustomerBookingsResultElement.innerHTML += `
                <div>
                    <p><strong>Booking #${index + 1}</strong></p>
                    <p>Booking ID: ${booking.bookingID}</p>
                    <p>Facility Name: ${booking.facilityName}</p>
                    <p>Date of Booking: ${formattedDate}</p>
                    <p>Total Charge: ${booking.totalCharge} Wei</p>
                    <p>User Name: ${booking.userNameCust}</p>
                    <p>Email Address: ${booking.emailAddressCust}</p>
					<br>
					<br>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error calling viewAllCustomerBookings:', error);
    }
}

async function viewAllBookingsByDate() {
    const contract = new window.web3.eth.Contract(contractABI, contractAddress);

    try {
		const bookingDate = document.getElementById('bookingDate2').value;
		const dateObject = new Date(bookingDate);
		// Format the date as DDMMYY
	const formattedDate = `${dateObject.getDate()}${(dateObject.getMonth() + 1).toString().padStart(2, '0')}${dateObject.getFullYear().toString().slice(-2)}`;

        // Use contract.methods.viewAllBookings() to call the function
        const result = await contract.methods.viewBookingsByDate(formattedDate).call();

        // Log the result to the console for debugging
        console.log("All Bookings Result:", result);
        // Display the result
        const allBookingsResultElement = document.getElementById('allBookingsResult');

        // Check if the HTML element exists
        if (!allBookingsResultElement) {
            console.error('HTML element not found: allBookingsResult');
            return;
        }

        allBookingsResultElement.innerHTML = `<h2>All Bookings</h2>`;
        result.forEach((booking, index) => {
            // You may want to format the date for better readability
            const dateValue = booking.dateOfBooking; // replace this with your actual dateOfBooking value
			// Extract day, month, and year values
			if (dateValue >100000){
				const day = dateValue.slice(0, 2);
				const month = dateValue.slice(2, 4);
				const year = dateValue.slice(4);

				// Format the date as D/MM/YY
			const formattedDate = `${day}/${month}/${year}`;

            allBookingsResultElement.innerHTML += `
                <div>
                    <p><strong>Booking #${index + 1}</strong></p>
                    <p>Facility Name: ${booking.facilityName}</p>
                    <p>Date of Booking: ${formattedDate}</p>
                    <p>Total Charge: ${booking.totalCharge} Wei</p>
                    <p>User Name: ${booking.userNameCust}</p>
                    <p>Email Address: ${booking.emailAddressCust}</p>
					<br>
					<br>
                </div>
            `;
			}
			else{
				const day = dateValue.slice(0, 1);
				const month = dateValue.slice(1, 3);
				const year = dateValue.slice(3);

				// Format the date as D/MM/YY
			const formattedDate = `${day}/${month}/${year}`;

            allBookingsResultElement.innerHTML += `
                <div>
                    <p><strong>Booking #${index + 1}</strong></p>
                    <p>Facility Name: ${booking.facilityName}</p>
                    <p>Date of Booking: ${formattedDate}</p>
                    <p>Total Charge: ${booking.totalCharge} Wei</p>
                    <p>User Name: ${booking.userNameCust}</p>
                    <p>Email Address: ${booking.emailAddressCust}</p>
					<br>
					<br>
                </div>
            `;

			}
			
			
			
        });
    } catch (error) {
        console.error('Error calling viewAllBookings:', error);
    }
}


async function removeFacility() {
    const contract = new window.web3.eth.Contract(contractABI, contractAddress);
    try {
        // Replace these lines with your form input values
		const facilityName = document.getElementById('facilityNameToRemove').value;
        

        // Use contract.methods.removeFacility() to call the function
        await contract.methods.removeFacility(facilityName).send({ from: window.web3.eth.defaultAccount });

        // Display the result
        const removeFacilityResultElement = document.getElementById('removeFacilityResult');
        removeFacilityResultElement.innerHTML = `<p>Facility ${facilityName} removed successfully.</p>`;

        // Call the function to update the number of facilities after removal
        await getNumberOfFacilities();
    } catch (error) {
        console.error('Error calling removeFacility:', error);
    }
}

async function updateFacilityPrice() {
    const contract = new window.web3.eth.Contract(contractABI, contractAddress);
    try {
        // Replace these lines with your form input values
		const facilityName = document.getElementById('facilityNameToUpdate').value;
		const newPrice = document.getElementById('newFacilityPrice').value;
        

        // Use contract.methods.updateFacilityPrice() to call the function
        await contract.methods.updateFacilityPrice(facilityName, newPrice).send({ from: window.web3.eth.defaultAccount });

        // Display the result
        const updateFacilityPriceResultElement = document.getElementById('updateFacilityPriceResult');
        updateFacilityPriceResultElement.innerHTML = `<p>Facility ${facilityName} price updated to ${newPrice} Wei.</p>`;
        
    } catch (error) {
        console.error('Error calling updateFacilityPrice:', error);
    }
}




//----------------------Customer Sections----------------------
// Add this after the code that populates facility options


User
async function bookFacility() {
    const contract = new window.web3.eth.Contract(contractABI, contractAddress);

	const dateOfBooking = document.getElementById('bookingDate').value;
	const dateObject = new Date(dateOfBooking);
	// Format the date as DDMMYY
	const formattedDate = `${dateObject.getDate()}${(dateObject.getMonth() + 1).toString().padStart(2, '0')}${dateObject.getFullYear().toString().slice(-2)}`;

	

        // Display the result
    
try {
    // Get form input values
    const facilityName = document.getElementById('facilitySelect').value;
    const priceElement = document.getElementById('price');
    const userName = document.getElementById('userName').value;
    const emailAddress = document.getElementById('emailAddress').value;
	const checkAvailabilityResultElement = document.getElementById('checkAvailabilityResult');
	const result = await contract.methods.checkFacilityAvailability(facilityName, formattedDate).call();

	if (result ==1){
		await contract.methods.bookFacility(
			facilityName,
			formattedDate, // Use the variable here instead of the constant
			userName,
			emailAddress
		).send({ from: window.web3.eth.defaultAccount, value: web3.utils.toWei(priceElement.value, 'ether') });
		checkAvailabilityResultElement.innerHTML = `<p>Successful Booking for ${facilityName} at ${dateOfBooking}</p>`;
	}
    // Use contract.methods.bookFacility() to call the function
    else{
		checkAvailabilityResultElement.innerHTML = `<p>Not available for ${facilityName} at ${dateOfBooking}, please reselect your date</p>`;
	}

    // ... rest of the code
} catch (error) {
    console.error('Error calling bookFacility:', error);
}
}

// Function to populate facility options in the dropdown
async function populateFacilityOptions(targetElement) {
    const contract = new window.web3.eth.Contract(contractABI, contractAddress);

    try {
        // Use contract.methods.getAllFacilityNames() to get all facility names
        const facilityNames = await contract.methods.getAllFacilityNames().call();

        // Get the target element
        const facilityElement = document.getElementById(targetElement);

        // Clear existing options
        facilityElement.innerHTML = '';

        // Add a default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = 'Select Facility';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        facilityElement.add(defaultOption);

        // Add options for each facility
        facilityNames.forEach((facilityName) => {
            const option = document.createElement('option');
            option.value = facilityName;
            option.text = facilityName;
            facilityElement.add(option);
        });
    } catch (error) {
        console.error(`Error populating ${targetElement} options:`, error);
    }
}


async function updatePriceForCustomer() {
	const contract = new window.web3.eth.Contract(contractABI, contractAddress);
    // Get the selected facility name from the dropdown
    const facilityName = document.getElementById('facilitySelect').value;

    // Get the facility price element
    const priceElement = document.getElementById('price');

    // If a facility is selected, update the price
    if (facilityName) {
        try {
            // Use contract.methods.getFacilityPrice() to get the price
            const price = await contract.methods.getFacilityPrice(facilityName).call();

            // Log the retrieved price to the console
            console.log(`Price for ${facilityName}: ${price}`);

            // Display the price in the input field
            priceElement.value = price;
        } catch (error) {
            console.error('Error updating facility price:', error);
        }
    } else {
        // If no facility is selected, reset the price field
        priceElement.value = '';
    }
}

async function viewCustomerBookings() {
    const contract = new window.web3.eth.Contract(contractABI, contractAddress);

    try {
        // Use contract.methods.viewCustomerBookings() to call the function
        const result = await contract.methods.viewCustomerBookings().call();

        // Display the result
        const customerBookingsResult = document.getElementById('customerBookingsResult');

        customerBookingsResult.innerHTML = ``;
        result.forEach((booking, index) => {
            // You may want to format the date for better readability
            const dateValue = booking.dateOfBooking; // replace this with your actual dateOfBooking value
			// Extract day, month, and year values
			const day = dateValue.slice(0, 2);
			const month = dateValue.slice(2, 4);
			const year = dateValue.slice(4);
			
			// Format the date as D/MM/YY
			const formattedDate = `${day}/${month}/${year}`;



            customerBookingsResult.innerHTML += `
                <div>
                    <p><strong>Booking #${index + 1}</strong></p>
                    <p>Facility Name: ${booking.facilityName}</p>
                    <p>Date of Booking: ${formattedDate}</p>
                    <p>Total Charge: ${booking.totalCharge} Wei</p>
                    <p>User Name: ${booking.userNameCust}</p>
                    <p>Email Address: ${booking.emailAddressCust}</p>
					<br>
					<br>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error calling viewAllCustomerBookings:', error);
    }
}


