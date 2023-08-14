// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener('DOMContentLoaded', () => {
	console.log('pruebitas-proj JS imported successfully!')
})

document.querySelector('#addIngredient').onclick = function () {
	const template = document.querySelector('#ingredient-group').cloneNode(true)
	document.querySelector('.content').appendChild(template)
	// document.querySelector('content').lastChild
}
