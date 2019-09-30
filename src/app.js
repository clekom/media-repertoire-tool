import interact from 'interactjs';
import Modal from './modal';
import TimeBudget from './timebudget';
import Activity from './activity';
import { createElement } from './helper';

class MRT {
	constructor() {
		this.textData = {};
		this.data = {
			dropItemData: [],
			timeBudgetData: [],
			actionItemData: [],
			id: this.create_UUID(),
			restructuredData: []
		};
		this.init();
	}

	async init() {
		await this.loadActivityItems();
		await this.loadTextInputs();
		this.initCircleCenter();
		this.initDraggables();
		this.initDropZones();
		this.initSubmitEvent();
		this.createTaskModal();
	}

	create_UUID(){
		let dt = new Date().getTime();
		let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			let r = (dt + Math.random()*16)%16 | 0;
			dt = Math.floor(dt/16);
			return (c=='x' ? r :(r&0x3|0x8)).toString(16);
		});
		return uuid;
	}

	initCircleCenter(){
		const center = document.querySelector('#cls-7');
		center.innerHTML =`<p>${this.textData.circleCenter}</p>`;
		console.log(center);
	}
	// event handler
	onDropHandler(event) {
		event.target.classList.remove('dragover');
		const zone = event.target.id;

		const itemExists = (dropItemName) => {
			return this.data.dropItemData.find(item => item.name === dropItemName);
		};
		const addItem = (dropItemName) => {
			const dropItemData = {
				name: dropItemName,
				zone,
			};

			this.data.dropItemData.push(dropItemData);
		};
		const updateItem = (dropItemName) => {
			this.data.dropItemData = this.data.dropItemData.map(item => {
				if (item.name === dropItemName) {
					return {
						...item,
						zone
					};
				}

				return item;
			});
		};
		const removeItem = (dropItemName) => {
			this.data.dropItemData = this.data.dropItemData.filter(item => item.name !== dropItemName);
		};
		const dropItemName = event.relatedTarget.id;

		if (event.target.nodeName === 'circle') {
			if (itemExists(dropItemName)) {
				updateItem(dropItemName);
			} else {
				addItem(dropItemName);
			}
		} else { // aus circle
			removeItem(dropItemName);
		}

	}

	onSubmitHandler(event) {
		const timeModal = new Modal();
		const sumTimeBudgets = () => {
			return this.data.timeBudgetData.reduce((currentValue, timeBudgetObject) => {
				return currentValue + timeBudgetObject.getBudgetValue();
			}, 0);
		};

		// Prefooter mit Summe TimeBudget
		const budgetSumContainer = createElement('div', 'result-zone, remainingTime');
		const budgetSumExceededWarning = createElement('div', 'timebudget-exceeded-warning');
		budgetSumExceededWarning.innerHTML = this.textData.timeBudget_exceeded;
		const budgetSumValue = createElement('span');
		budgetSumValue.innerHTML = '100 %';
		const div = createElement('div');
		div.innerHTML = 'Verbleibend: ';
		div.appendChild(budgetSumValue);
		budgetSumContainer.appendChild(div);
		budgetSumContainer.appendChild(budgetSumExceededWarning);
		timeModal.setPreBodyContent(budgetSumContainer);

		// Footer -> Submit Button einfügen
		const forwardButton = createElement('button', 'modalButtonStyle');
		forwardButton.innerText = 'Weiter';
		forwardButton.addEventListener('click', () => {
			//Hier wird das ActivityModal geöffnet wenn der Button weiter gedrückt wird.
			this.saveTimeData();
			//zerstört das TimeModal
			timeModal.close();
			// ruft das Activity Modal auf.
			this.createActivityModal();
		});

		timeModal.setFooterContent(forwardButton);

		// TimeBudget Items anhängen
		this.data.timeBudgetData = this.data.dropItemData.map(dropItem => {
			// TimeBudget object setup
			const timeBudget = new TimeBudget();
			timeBudget.setName(dropItem.name);
			timeBudget.setIconSrc(dropItem.name);
			timeBudget.getSlider().addEventListener('input', () => {
				const isTimeBudgetLeft = 100 - sumTimeBudgets() >= 0;
				budgetSumValue.innerText = `${(100 - sumTimeBudgets())} %`;

				if (!isTimeBudgetLeft) {
					budgetSumContainer.classList.add('timebudget-exceeded');
					forwardButton.disabled = true;
				} else {
					budgetSumContainer.classList.remove('timebudget-exceeded');
					forwardButton.disabled = false;
				}
			});

			// append TimeBudget item to modal's content
			timeModal.setContent(timeBudget.getContent());

			return timeBudget;
		});

		// set other modal contents and show
		timeModal.setTitle(this.textData.timeBudget_title);
		timeModal.setDescription(this.textData.timeBudget_text);
		timeModal.show();
	}

	// for connecting with external questionaire tools
	getUrlParamerter(sParam) {
		let sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	}

	saveTimeData() {
		const timeBudgets = this.data.timeBudgetData;
		for (let timebudget of timeBudgets) {
			const name = timebudget.name;
			const value = timebudget.slider.valueAsNumber;

			this.data.dropItemData = this.data.dropItemData.map((item) => {
				if (item.name === name) {
					return {
						...item,
						timevalue: value
					};
				}
				return item;
			});
		}


	}

	createActivityModal() {
		const activityModal = new Modal();
		this.data.actionItemData = this.data.dropItemData.map(dropItem => {
			const activity = new Activity();
			activity.setName(dropItem.name);
			activity.setIconSrc(dropItem.name);
			activityModal.setContent(activity.getContent());

			return activity;
		});

		activityModal.setTitle(this.textData.activity_title);
		activityModal.setDescription(this.textData.activity_text);
		activityModal.show();

		const saveButton = createElement('div', 'modalButtonStyle');
		saveButton.innerText = 'Weiter';
		activityModal.footer.appendChild(saveButton);

		saveButton.addEventListener('click', async () => {
			this.saveActivityData();
			//send data and redirect to unipark
			await this.sendAllData();
			// close and destroy modal
			activityModal.close();

		});
	}

	saveActivityData() {
		const activityItems = this.data.actionItemData;
		for (let activityItem of activityItems) {
			const name = activityItem.name;
			const activity = activityItem.activityInput.value;

			this.data.dropItemData = this.data.dropItemData.map((item) => {
				if (item.name === name) {
					return {
						...item,
						activity: activity
					};
				}
				return item;
			});
		}
	}

	sendAllData() {
		console.log(this.data.dropItemData);
		const target = 'php/data.php';
		const data = {
			itemdata: this.data.dropItemData,
			id: this.data.id
		};
		console.log(data);

		fetch(target, {
			method: "POST",
			mode: "same-origin",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				data
			})
		}).then(res => {
			const response = res.json();
			console.log("Sucess:", JSON.stringify(response));

			return response;
		})
			.then(() => {
				document.location.href = 'success.html';
			})
			.catch(error => {
				console.error('Error:', error);
			});
	}

	loadTextInputs() {
		const path = 'text/texts.json';
		return fetch(path).then(response => response.json()).then(textData => {
			this.textData = textData;
		})
			.catch((error) => {
				console.error(error);
			});
	}

	loadActivityItems() {
		const url = 'php/get-activity-icons.php';

		return fetch(url).then(response => response.json()).then(iconList => {
			// Aktuelle Auswahl
			const currentSelection = createElement('div', 'current-selection');
			currentSelection.innerText = '–';
			document.querySelector('#itemsContainer').appendChild(currentSelection);

			// Icons
			iconList.forEach(icon => {
				const name = icon.name.split('.').shift();
				const img = new Image();
				img.src = icon.path;
				img.border = '0';
				img.classList.add('item');
				img.classList.add('draggable');
				img.id = name;
				img.addEventListener('mouseover', () => {
					currentSelection.innerText = name.toUpperCase();
				});
				img.addEventListener('mouseout', () => {
					currentSelection.innerText = '–';
				});
				img.addEventListener('touchstart', () => {
					currentSelection.innerText = name.toUpperCase();
				});
				img.addEventListener('touchend', () => {
					currentSelection.innerText = '–';
				});


				document.querySelector('#items').appendChild(img);
			});
		}).catch((error) => {
			console.error(error);
		});
	}

	initDraggables() {
		interact('.draggable')
			.draggable({
				// enable inertial throwing
				inertia: true,
				// Definitionen von Restriktionen TODO herausfinden, ob für uns nötig. Bzw. Restriktion für CSS Klasse .zone hinbekommen, das geht aber bisher nicht
				restrict: {
					restriction: 'self',
					endOnly: true,
				},
				// enable autoScroll
				autoScroll: true,

				// Bei jedem Dragmove wird die Funktion dragMoveListener aufgerufen
				// Diese Funktion wird am Ende des Drag-Events aufgerufen. Sie sorgt dafür, dass das Element an exakt der Stelle liegen bleibt, an der die Maus losgelassen wurde.
				onmove: function (event) {
					const target = event.target,
						// keep the dragged position in the data-x/data-y attributes
						x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
						y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

					// translate the element
					target.style.webkitTransform =
						target.style.transform =
							'translate(' + x + 'px, ' + y + 'px)';

					// update the posiion attributes
					target.setAttribute('data-x', x);
					target.setAttribute('data-y', y);
				},
			});
	}

	initDropZones() {
		//Alle Elemente mit der Klasse zone werden zu Dropzones!
		interact('.zone').dropzone({
			// Die Dropzone akzeptiert ausschließlich Items des Klasse .item
			accept: '.item',

			// Drop Event Bestimmungen für die Dropzones
			ondragenter: function (event) {
				const dropzoneElement = event.target;
				// Fügt der Zone über die das Element geführt wird die Klasse dragove hinzu. Erzeugt visuelles Feedback für den Probanden
				dropzoneElement.classList.add('dragover');
			},

			ondragleave: function (event) {
				// Entfernt das visuelle Feedback, wenn die Zone verlassen wird
				event.target.classList.remove('dragover');
			},

			ondrop: (event) => {
				this.onDropHandler(event);
			}
		});
	}

	initSubmitEvent() {
		document.querySelector('#submitbutton').addEventListener('click', event => {
			if (this.data.dropItemData.length !== 0) {
				this.onSubmitHandler(event);
			}
			else {
				alert('Bitte sortieren Sie mindestens ein Item ein, bevor Sie fortfahren.');
			}
		});
	}

	createTaskModal() {
		document.getElementById('info').addEventListener('click', () => {
			const taskModal = new Modal();
			taskModal.setTitle(this.textData.instruction_title);
			taskModal.setDescription(this.textData.instruction_text);
			taskModal.show();
		});
	}
}

(function (window) {
	const mrt = new MRT();
	window.mrt = mrt;
})(window);
