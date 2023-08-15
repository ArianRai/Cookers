// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener('DOMContentLoaded', () => {
	console.log('pruebitas-proj JS imported successfully!')
})

document.querySelector('#addIngredient').onclick = function () {
	const template = document.querySelector('#ingredient-group').cloneNode(true)
	document.querySelector('.content').appendChild(template)
	restartInput()
}

const restartInput = () => {
	const igredientInputs = document.querySelectorAll('#ingredientInput')
	igredientInputs[igredientInputs.length - 1].value = ''
	const quantityInputs = document.querySelectorAll('#quantityInput')
	quantityInputs[quantityInputs.length - 1].value = ''
}

document.querySelector('#removeIngredient').onclick = function () {
	const ingredientInputs = document.querySelectorAll('#ingredient-group')
	if (ingredientInputs.length > 1) {
		document.querySelector('.content').lastChild.remove()
	}
}
