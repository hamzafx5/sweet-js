/*---------------
library name: sweetui
version: 1.0
author full name: Hamza Bouchkara
Project repo: https://github.dev/hamzafx5/sweet-js
---------------*/

(function (win, doc, body) {
	doc.ready = function (cb) {
		doc.addEventListener("readystatechange", () => {
			if (doc.readyState === "complete") {
				cb();
			}
		});
	};

	win.randomNumber = function (min, max) {
		let randomNum = Math.random() * max;
		if (randomNum < min) {
			randomNum += min - randomNum;
			const x = Math.random() * 8 + 2;
			randomNum += max / x;
		}
		randomNum = Math.floor(randomNum);
		return randomNum;
	};

	win.randomColor = function (format = "hex") {
		let color = "";
		if (format === "rgb") {
			color = `rgb(
                ${randomNumber(0, 255)},
                ${randomNumber(0, 255)},
                ${randomNumber(0, 255)}
            )`;
		} else if (format === "hsl") {
			color = `hsl(
                ${randomNumber(0, 360)},
                ${randomNumber(0, 100)}%,
                ${randomNumber(0, 100)}%
            )`;
		} else if (format === "hex") {
			let hexValues = "abcdef0123456789";
			let generatedColor = "";
			for (let i = 0; i < 6; i++) {
				generatedColor += hexValues[randomNumber(0, hexValues.length)];
			}
			color = "#" + generatedColor;
		}
		color = color.replace(/(\n|\s)/g, "");
		return color;
	};

	win.randomString = function (
		{ lowercase = true, uppercase = true, numbers = true, symbols = true },
		lengthOfString = 12,
	) {
		let randomString = "";
		let string = "";
		const stringFormation = {
			lowercase: lowercase ? "azertyuiopmlkjhgfdsqwxcvbn" : "",
			uppercase: uppercase ? "AZERTYUIOPMLKJHGFDSQWXCVBN" : "",
			numbers: numbers ? "0123456789" : "",
			symbols: symbols ? "&\"'()-_{}[]@$*%!:/;.,?=+\\<>" : "",
		};

		for (let [, value] of Object.entries(stringFormation)) {
			if (value) {
				string += value;
			}
		}

		for (let i = 0; i < lengthOfString; i++) {
			randomString += string[randomNumber(0, string.length - 1)];
		}

		randomString.trim();

		return randomString;
	};

	// classes
	class ElementCollection extends Array {
		constructor() {
			super(...arguments);
			this.elements = [...arguments];
			this.isVisibleCalledCb = false;
		}

		get html() {
			return this.elements.length === 1 ? this.elements[0] : this.elements;
		}
		on(event, cbOrSelector, cb) {
			if (typeof cbOrSelector === "function") {
				this.forEach((el) => {
					el.addEventListener(event, cbOrSelector);
				});
			} else {
				this.forEach((el) => {
					el.addEventListener(event, (e) => {
						if (e.target.classList.contains(cbOrSelector)) {
							cb(e);
						}
					});
				});
			}

			return this;
		}

		css(style) {
			this.forEach((el) => {
				for (let [property, value] of Object.entries(style)) {
					el.style[property] = value;
				}
			});
			return this;
		}

		setAspect(x = 16, y = 9) {
			win.addEventListener("resize", () => {
				this.forEach((el) => _setAspect(el));
			});
			this.forEach((el) => _setAspect(el));
			function _setAspect(el) {
				const height = (el.clientWidth / x) * y;
				el.style.height = `${Math.round(height)}px`;
			}
		}

		addClass(className) {
			this.forEach((el) => el.classList.add(className));
		}
		removeClass(className) {
			this.forEach((el) => el.classList.remove(className));
		}
		toggleClass(className) {
			this.forEach((el) => el.classList.toggle(className));
		}
		hasClass(className) {
			return this.some((el) => {
				return el.classList.contains(className);
			});
		}

		setState(state, style) {
			const identifier = randomString({ symbols: false, numbers: false }, 5);
			this.addClass(identifier);
			const styleElIdentifier = "_js_styles_output";

			if (!doc.querySelector("." + styleElIdentifier)) {
				const el = doc.createElement("style");
				el.className = styleElIdentifier;
				doc.head.appendChild(el);
			}

			const styleTag = doc.querySelector("." + styleElIdentifier);

			styleTag.textContent += formatStyleObjIntoCss(identifier, style);

			function formatStyleObjIntoCss(selector, _style) {
				let rawStyle = "";
				let formattedStyle = "";

				for (let [property, value] of Object.entries(_style)) {
					rawStyle += `\n\t${formatProperty(property)}: ${value};`;
				}

				function formatProperty(property) {
					return property.replace(/[A-Z]/g, (char) => {
						return `-${char.toLowerCase()}`;
					});
				}

				formattedStyle = `\n.${selector}:${state} {${rawStyle}\n}\n`;

				return formattedStyle;
			}

			return this;
		}

		next() {
			return this.map((el) => el.nextElementSibling).filter((el) => el !== null);
		}

		previous() {
			return this.map((el) => el.previousElementSibling).filter((el) => el !== null);
		}

		isVisible(cb, howMatchIsVisible = 80) {
			this.forEach((el) => {
				win.addEventListener("scroll", () => {
					if (this.isVisibleCalledCb) return;
					if (win.scrollY >= el.offsetTop - innerHeight + (el.clientHeight / 100) * howMatchIsVisible) {
						this.isVisibleCalledCb = true;
						cb();
					}
				});
			});
			return this;
		}

		setAttribute(obj) {
			this.forEach((el) => {
				for (let [attr, value] of Object.entries(obj)) {
					el.setAttribute(attr, value);
				}
			});
			return this;
		}

		getAttribute(value) {
			const attr = this.map((el) => el.getAttribute(value)).filter((attr) => attr);
			if (attr !== null) {
				return attr.length === 1 ? attr[0] : attr;
			}
		}
	}

	win.$ = function (pram) {
		if (typeof pram === "string" || pram instanceof String) {
			return new ElementCollection(...document.querySelectorAll(pram));
		} else {
			return new ElementCollection(pram);
		}
	};
	win.insertElement = function ({ type = "div", appendTo }) {
		const identifier = randomString({ symbols: false, numbers: false }, 6);
		const el = doc.createElement(type);
		el.className = identifier;
		appendTo.appendChild(el);
		return $(`.${identifier}`);
	};
	win.animate = function animate(cb) {
		function a() {
			cb();
			requestAnimationFrame(a);
		}
		a();
	};
})(window, document, document.body);
