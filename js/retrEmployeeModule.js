
let retrieveEmployeeModule = (function($){

	let employees = [];
	let url = 'https://randomuser.me/api/';

	const gallery = ${'#gallery'};



	function getTwelveEmployees(){
		$.getJSON(url, {results:12}, logEmployees);
	};

	function logEmployees(employees){
		employees.forEach(function(employ){
			console.log(employ)
		})
	};

	getTwelveEmployees();

})(jQuery);