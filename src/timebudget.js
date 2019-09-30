import { createElement } from './helper';

export default class TimeBudget {
	ICON_PATH = './images/icons/';

	constructor() {
		this.name = '';
		this.create();
		this.initUI();
		this.bindEvents();
	}

	setName(name) {
		this.name = name;
	}

	getBudgetValue() {
		return parseInt(this.slider.value, 10);
	}

	getSlider() {
		return this.slider;
	}

	initUI() {
		this.percentage.innerText = '0 %';
	}

	bindEvents() {
		this.slider.addEventListener('change', () => {
			if (this.isLocked) {
				return false;
			}

			this.percentage.innerText = `${this.slider.value} %`;
		});

		this.slider.addEventListener('input', () => {
			if (this.isLocked) {
				return false;
			}

			this.percentage.innerText = `${this.slider.value} %`;
		});
	}

	createIcon(cx) {
		const icon = new Image();
		icon.classList.add(cx);

		return icon;
	}

	createSlider(cx) {
		const slider = createElement('input', cx);
		slider.type = 'range';
		slider.min = '0';
		slider.max = '100';
		slider.value = '0';

		return slider;
	}


	setIconSrc(iconName) {
		this.icon.src = `${this.ICON_PATH}${iconName}.png`;
	}

	getContent() {
		return this.row;
	}

	create() {
		this.row = createElement('div', 'row, input-rows');
		this.columnLeft = createElement('div', 'col-3, justify-content-center');
		this.columnCenter = createElement('div', 'col-7, justify-content-center, align-items-center, d-flex');
		this.columnRight = createElement('div', 'col-2, justify-content-center, align-items-center, d-flex, singleSliderResult');
		this.icon = this.createIcon('small-item');
		this.slider = this.createSlider('timeBudgetInput, slider');
		this.percentage = createElement('span');

		this.row.appendChild(this.columnLeft);
		this.row.appendChild(this.columnCenter);
		this.row.appendChild(this.columnRight);
		this.columnLeft.appendChild(this.icon);
		this.columnCenter.appendChild(this.slider);
		this.columnRight.appendChild(this.percentage);
	}

	destroy() {
		this.row = null;
		this.columnLeft = null;
		this.columnCenter = null;
		this.columnRight = null;
		this.icon = null;
		this.slider = null;
		this.percentage = null;
	}
}
