import { createElement } from './helper';

export default class Activity {
	ICON_PATH = './images/icons/';

	constructor () {
		this.create();
		this.name = '';

	}

	setName(name) {
		this.name = name;
	}
	create() {
		this.row = createElement('div', 'row, input-rows');
		this.columnLeft = createElement('div', 'col-3, justify-content-center');
		this.columnRight = createElement('div', 'col-9, justify-content-center, align-items-center, d-flex');
		this.icon = this.createIcon('small-item');
		this.activityInput = createElement('textarea', 'activityInput');

		this.row.appendChild(this.columnLeft);
		this.row.appendChild(this.columnRight);
		this.columnLeft.appendChild(this.icon);
		this.columnRight.appendChild(this.activityInput);
	}

	createIcon(cx) {
		const icon = new Image();
		icon.classList.add(cx);

		return icon;
	}

	setIconSrc(iconName) {
		this.icon.src = `${this.ICON_PATH}${iconName}.png`;
	}

	getContent() {
		return this.row;
	}

}