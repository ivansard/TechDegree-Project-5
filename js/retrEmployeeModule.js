
let retrieveEmployeeModule = (function($){

	let employeeArray = [];
	let url = 'https://randomuser.me/api/';

	const $gallery = $('#gallery');
	let $cards;

	let searchSeed;
	const $modalContainer = $('<div class="modal-container"></div>`');
	let activeEmployee;



	function getTwelveEmployees(){
		$.getJSON(url, {results:12}, generateGalleryHtml);
	};

	function generateGalleryHtml(employees){
		let galleryHtml = "";
		searchSeed = employees.info.seed;
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
		renderGalleryHtml(galleryHtml);
		$cards = $('.card');
		addEventListenersToCards($cards);
	};

	function renderGalleryHtml(galleryHtml){
		$gallery.html(galleryHtml);
	}


	function generateModalWindowHTML(clickedCard){

		console.log(clickedCard.target);
		const clikedCardEmail = $(clickedCard.target).children();
		console.log(clikedCardEmail);

		
	}


	function addEventListenersToCards(cards){
		cards.on('click', event => {
			let targetedCard = event.target;
			while($.inArray(targetedCard, cards) == -1){
				targetedCard = targetedCard.parentNode;
			}

			const employeeIndex = $.inArray(targetedCard, cards);
			activeEmployee = employeeArray[employeeIndex];


			let modalWindowHhtml = createModalWindowForEmployee(activeEmployee);
			$modalContainer.html(modalWindowHhtml);
			$('body').append($modalContainer);		
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

			let clickedButton = event.target;
			while(clickedButton.type !== 'button'){
				clickedButton = event.target.parentNode;
			}

			if(clickedButton.id === "modal-close-btn"){
				removeModalWindow();				
			}

			if(clickedButton.id === "modal-prev"){
				showPreviousEmployee();
			}

			if(clickedButton.id === "modal-next"){
				showNextEmployee();
			}


		})	
	}

	function showPreviousEmployee(){
		//Find index of active employee in the array
		const activeEmployeeIndex = $.inArray(activeEmployee, employeeArray);
		//Check if the index is zero, if it is do nothing,
		if(activeEmployeeIndex === 0 ){
			return;
		}
		//If it isn't, the find the element with the previous index
		activeEmployee = employeeArray[activeEmployeeIndex - 1];
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
		const activeEmployeeIndex = $.inArray(activeEmployee, employeeArray);
		//Check if the index is zero, if it is do nothing,
		if(activeEmployeeIndex === employeeArray.length-1){
			return;
		}
		//If it isn't, the find the element with the previous index
		activeEmployee = employeeArray[activeEmployeeIndex + 1];
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
    // return string.charAt(0).toUpperCase() + string.slice(1);
	}

	getTwelveEmployees();

			

})(jQuery);

// ${clickedEmployee.dob.date}


