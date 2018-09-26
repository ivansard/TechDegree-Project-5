$(document).ready(function(){
	let retrieveEmployeeModule = (function($){

	//An array where all retrieved employees will be stored
	let employeeArray = [];
	//An array which will be used when users search based on employee name
	//At the beginning it is equal to the whole employee array
	let filteredEmployeeArray = employeeArray;
	//The url towards the employee API
	let url = 'https://randomuser.me/api';

	//Gallery element
	const $gallery = $('#gallery');
	//Element which will select all card elements
	let $cards;
	//Modal container for a single employee
	const $modalContainer = $('<div class="modal-container"></div>`');
	//The employee who's modal container is rendered
	let activeEmployee;

	//Search input form
	$inputForm = $(`<form action="#" method="get"></form>`).css('display', 'block');


	//Initializing the app

	function init(){				
		$.getJSON(url, {results: 12,
						nat: ['AU', 'BR', 'CA', 'CH', 'DE', 'DK', 'ES', 'FI',
							  'FR', 'GB', 'IE', 'NO', 'NL', 'NZ', 'TR', 'US']}).then(generateGalleryHtml)
																			    .then(renderGalleryHtml)
																			    .then(addEventListenersToCards)
																			    .then(appendSearchForm)
																			    .catch(function(error){
																			   		$gallery.html(error.getMessage());
																			   });
	};

	//Function thag generates the inner HTML of the gallery div for all employees retrieved from the server
	function generateGalleryHtml(employees){
		let galleryHtml = "";
		employees.results.forEach(employee => {
			let employeeHtml = `<div class="card">
									<div class="card-img-container">
									    <img class="card-img" src=${employee.picture.large} alt="profile picture">
									</div>
									<div class="card-info-container">
									    <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
									    <p class="card-text">${employee.email}</p>
									    <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
									</div>
								</div>`;
			galleryHtml += employeeHtml;
			employeeArray.push(employee);
		})
		return galleryHtml;
	};

	//Rendering the gallery itself
	function renderGalleryHtml(galleryHtml){
		$gallery.html(galleryHtml);
	}


	//Adding click listeners to employee cards
	function addEventListenersToCards(){
		//After the cards have been rendered, we assign them to the variable $cards
		$cards = $('.card');
		$cards.on('click', event => {
			//Because sometimes the users will click on the image, or some text, we must traverse the DOM to access
			//the card element itself
			let targetedCard = event.target;
			while($.inArray(targetedCard, $cards) == -1){
				targetedCard = targetedCard.parentNode;
			}

			//We find the index of the clicked card in cards, and it is equivalent to the index of the employees in the employee array
			const employeeIndex = $.inArray(targetedCard, $cards);
			activeEmployee = employeeArray[employeeIndex];

			//Creating and rendering the newly created modal window
			let modalWindowHhtml = createModalWindowForEmployee(activeEmployee);
			$modalContainer.html(modalWindowHhtml);
			$('body').append($modalContainer);		
			//Adding event listeners to the modal window
			addEventListenersToModalWindowButtons();	
		});
	}

	function createModalWindowForEmployee(employee){

		let modalWindowHhtml = `<div class="modal">
									    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
									    <div class="modal-info-container">
									        <img class="modal-img" src=${employee.picture.large} alt="profile picture">
									        <h3 id="name" class="modal-name cap">${capitalizeFirstLetter(employee.name.first)} ${capitalizeFirstLetter(employee.name.last)}</h3>
									        <p class="modal-text">${employee.email}</p>
									        <p class="modal-text cap">${capitalizeFirstLetter(employee.location.city)}</p>
									        <hr>
									        <p class="modal-text">${employee.phone}</p>
									        <p class="modal-text">${capitalizeFirstLetter(employee.location.street)}, ${capitalizeFirstLetter(employee.location.city)}, ${capitalizeFirstLetter(employee.location.state)} ${employee.location.postcode}</p>
									        <p class="modal-text">Birthday: ${new Date(employee.dob.date).toUTCString()} </p>
									    </div>
									</div>
									<div class="modal-btn-container">
									    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
									    <button type="button" id="modal-next" class="modal-next btn">Next</button>
									</div>`
		return modalWindowHhtml;
	}

	function addEventListenersToModalWindowButtons(){
		$('button').on('click', event => {

			//Again traversing, this time because of the bolded X in the closing button
			let clickedButton = event.target;
			while(clickedButton.type !== 'button'){
				clickedButton = event.target.parentNode;
			}

			switch(clickedButton.id){
				case "modal-close-btn":
					removeModalWindow();
					break;
				case "modal-prev":
					showPreviousEmployee();
					break;
				case "modal-next":
					showNextEmployee();
					break;
				default:
					break;
			}
		})	
	}
		

	function showPreviousEmployee(){



		//Find index of active employee in the array
		const activeEmployeeIndex = $.inArray(activeEmployee, filteredEmployeeArray);
		//Check if the active employee is the first one in the list, if it is do nothing,
		if(activeEmployeeIndex === 0 ){
			return;
		}
		//If it isn't, the find the employee with the previous index
		activeEmployee = filteredEmployeeArray	[activeEmployeeIndex - 1];
		//Remove the current modal window
		$modalContainer.remove();
		//Create a new modal window based on the new employee
		let modalWindowHhtml = createModalWindowForEmployee(activeEmployee);
		$modalContainer.html(modalWindowHhtml);
		$('body').append($modalContainer);		
		addEventListenersToModalWindowButtons();
	}

	function showNextEmployee(){
		//Find index of active employee in the array
		const activeEmployeeIndex = $.inArray(activeEmployee, filteredEmployeeArray);
		//Check if the active employee is the last one in the list, if it is do nothing,
		if(activeEmployeeIndex === filteredEmployeeArray.length-1){
			return;
		}
		//If it isn't, the find the element with the next index
		activeEmployee = filteredEmployeeArray[activeEmployeeIndex + 1];
		//Remove the current modal window
		$modalContainer.remove();
		//Create a new modal window based on the new employee
		let modalWindowHhtml = createModalWindowForEmployee(activeEmployee);
		$modalContainer.html(modalWindowHhtml);
		$('body').append($modalContainer);		
		addEventListenersToModalWindowButtons();
	}

	function removeModalWindow(){
		$modalContainer.remove();
	}

	function capitalizeFirstLetter(string) {
		return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
	}

	//Creating the search input form
	function generateSearchFormHtml(){
		return `<input type="search" id="search-input" class="search-input" placeholder="Search...">
                <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">`;
	}

	function createSearchForm(){
		return $inputForm.html(generateSearchFormHtml());
	}

	function appendSearchForm(){
		$('.search-container').append(createSearchForm());
		addEventListenerToForm();
	}
	//Add event listener on keyup for filtering the results
	function addEventListenerToForm(){
		$inputForm.on('keyup', event => {
			const inputField = event.target;
			let input = inputField.value.toLowerCase();

			filteredEmployeeArray = [];

			employeeArray.forEach((employee, index) => {
				if(employee.name.first.toLowerCase().includes(input) || employee.name.first.toLowerCase().includes(input)){
					$($cards.get(index)).show();
					filteredEmployeeArray.push(employee);
				} else {
					$($cards.get(index)).hide();
				}
			})

		})
	}
	//Initializing the module
	init();

	})(jQuery); //end module
}) //end document ready



