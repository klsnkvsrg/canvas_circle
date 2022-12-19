'use strikt';

let Canvas = window.C = {
	id: '',
	width: 0,
	height: 0,
	fillColor: '',
	hoverColor: '',
	lineColor: '',
	textColor: '',
	mainImage: '',
	lineWidth: 1,
	items: [],
	startAngle: 0,

	canvas: null,
	ctx: null,

	init: function(params) {
		console.log(params);
		this.id = params.id;
		this.width = params.width;
		this.height = params.height;
		this.fillColor = params.fillColor;
		this.hoverColor = params.hoverColor;
		this.lineColor = params.lineColor;
		this.textColor = params.textColor;
		this.mainImage = params.mainImage;
		this.lineWidth = params.lineWidth;
		this.fontSize = params.fontSize;
		this.items = params.items;
		this.startAngle = params.startAngle;

		this.initCanvas();
		this.initSize();
		this.initItems();
		this.drawSectors();
		this.drawLines();
		this.drawTexts();
		this.drawMainImage();
		this.bindEvents();
		console.log('this', this);
	},

	initCanvas: function() {
		this.canvas = document.querySelector('#'+this.id);
		if (!!this.canvas) {
			this.ctx = this.canvas.getContext('2d');
		}
	},

	initSize: function() {
		if (!!this.canvas) {
			if (this.width > 0) {
				this.canvas.width = this.width;
			}

			if (this.height > 0) {
				this.canvas.height = this.height;
			}
		}
	},

	initItems: function() {
		let count, radius, angle, i;
		count = this.items.length;
		angle = this.startAngle;
		radius = this.width / 2;
		for (i = 0; i < count; i++) {
			this.items[i].points = [];
			this.items[i].points.push({
				x: this.width / 2 + radius / 2 * Math.cos(angle),
				y: this.height / 2 + radius / 2 * Math.sin(angle),
			});
			this.items[i].points.push({
				x: this.width/2 + radius * Math.cos(angle),
				y: this.height/2 + radius * Math.sin(angle),
			});
			angle += Math.PI * 2 / count;
			this.items[i].points.push({
				x: this.width/2 + radius * Math.cos(angle),
				y: this.height/2 + radius * Math.sin(angle),
			});
			this.items[i].points.push({
				x: this.width / 2 + radius / 2 * Math.cos(angle),
				y: this.height / 2 + radius / 2 * Math.sin(angle),
			});
		}
	},

	setFillColor: function(color) {
		if (color.length > 0) {
			this.ctx.fillStyle = color;
		}
	},

	setStrokeColor: function(color) {
		if (color.length > 0) {
			this.ctx.strokeStyle = color;
		}
	},

	setLineWidth: function(width) {
		if (width > 0) {
			this.ctx.lineWidth = width;
		}
	},

	setFontStyle: function(size, family = 'sans-serif') {
		if (size > 0) {
			this.ctx.font = size + 'px ' + family;
		}
	},

	drawSectors: function() {
		let count, startAngle, endAngle, radius, i;
		this.setFontStyle(this.fontSize);
		if (this.items.length > 0) {
			count = this.items.length;
			startAngle = this.startAngle;
			radius = this.width / 2;
			maxWidth = radius / 2;
			for (i = 0; i < count; i++) {
				endAngle = startAngle + Math.PI * 2 / count;
				this.drawSector(
					this.items[i]
					,this.width / 2
					,this.height /2
					,radius
					,startAngle
					,endAngle
					,this.fillColor
				);

				startAngle = endAngle;
			}
		}
	},

	drawSector: function(item, centerX, centerY, radius, startAngle, endAngle, color) {
		this.setFillColor(color);
		this.ctx.beginPath();
		this.ctx.moveTo(item.points[0].x, item.points[0].y);
		this.ctx.lineTo(item.points[1].x, item.points[1].y);
		this.ctx.arc(
			centerX
			,centerY
			,radius
			,startAngle
			,endAngle
			,false
		);
		this.ctx.lineTo(item.points[3].x, item.points[3].y);
		this.ctx.arc(
			centerX
			,centerY
			,radius / 2
			,endAngle
			,startAngle
			,true
		);
		this.ctx.fill();
	},

	drawLines: function() {
		let count, angle, i;
		if (this.items.length > 0) {
			count = this.items.length;
			angle = this.startAngle + Math.PI * 2 / count;
			for (i = 0; i < count; i++) {
				this.drawLine(this.items[i], angle);
				angle += Math.PI * 2 / count;
			}
		}
	},

	drawLine: function(item, angle) {
		this.setStrokeColor(this.lineColor);
		this.setLineWidth(this.lineWidth);
		this.ctx.beginPath();
		this.ctx.moveTo(item.points[0].x, item.points[0].y);
		this.ctx.lineTo(item.points[1].x, item.points[1].y);
		this.ctx.stroke();
		this.ctx.beginPath();
		this.ctx.moveTo(item.points[2].x, item.points[2].y);
		this.ctx.lineTo(item.points[3].x, item.points[3].y);
		this.ctx.stroke();
	},

	drawTexts: function() {
		let count, angle, radius, i;
		this.setFontStyle(this.fontSize);
		if (this.items.length > 0) {
			count = this.items.length;
			angle = this.startAngle;
			radius = this.width / 2;
			for (i = 0; i < count; i++) {
				this.drawText(this.items[i].name, radius, angle);
				angle += Math.PI * 2 / count;
			}
		}
	},

	drawText: function(text, radius, angle) {
		let textData, count, textX, textY, maxWidth;
		this.setFontStyle(this.fontSize);
		this.setFillColor(this.textColor);
		count = this.items.length;
		maxWidth = radius / 2;
		textData = this.ctx.measureText(text, radius, angle);
		textX = this.width/2 + radius * 3 / 4 * Math.cos(angle + Math.PI * 2 / count / 2) - textData.width / 2;
		textY = this.height/2 + radius * 3 / 4 * Math.sin(angle + Math.PI * 2 / count / 2);
		this.ctx.fillText(text, textX, textY, maxWidth);
	},

	drawMainImage: function() {
		let image, imageWidth, imageHeight, _that, pattern;
		if (this.mainImage.length > 0) {
			imageWidth = this.width / 2;
			imageHeight = this.height / 2;
			image = new Image();
			_that = this;
			image.onload = function() {
				_that.ctx.beginPath();
				_that.ctx.arc(
					_that.width / 2
					,_that.height / 2
					, _that.width / 4
					,0
					,Math.PI * 2
					,false
				);
				_that.ctx.clip();
				_that.ctx.drawImage(
					image
					,_that.width / 4
					,_that.height / 4
					,_that.width / 2
					,_that.height / 2
				);
			};
			image.src = this.mainImage;
		}
	},

	bindEvents: function() {
		let _that = this;
		if (!!this.canvas) {
			this.canvas.addEventListener('mousemove', function(event) {
				_that.moveAction(event);
			});
		}
	},

	moveAction: function(e) {
		// console.log('e', e);
		// console.log('this', this);
		/*
		при движении мыши нужно находить позицию мыши относительно
		центра окружности, для данной точки находить угол поворота
		относительно центра и радиус окружности
		*/
		let x, y, position;
		x = e.clientX;
		y = e.clientY;
		// console.log('[x, y]', [x, y]);
		position = this.getPosition();
		// console.log('position', position);
	},

	getPosition: function() {
		let position = this.canvas.getBoundingClientRect();
		return position;
	},
};
