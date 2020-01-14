"use strict";

var CreateElement = (function() {

    function CreateElement(element) {
      this.element = document.createElement(element);
      return this;
    }

    CreateElement.prototype.class = function _class() {
      var _this = this;

      Array.prototype.slice.call(arguments).forEach(function(string) {
        return _this.element.classList.add(string);
      });
      return this;
    };

    CreateElement.prototype.id = function id(string) {
      this.element.id = string;
      return this;
    };

    CreateElement.prototype.html = function html(string) {
      this.element.innerHTML = string;
      return this;
    };

    CreateElement.prototype.text = function text(string) {
      this.element.textContent = string;
      return this;
    };

    CreateElement.prototype.dataset = function dataset(key, value) {
      this.element.dataset[key] = value;
      return this;
    };

    CreateElement.prototype.build = function build() {
      return this.element;
    };

    return CreateElement;
  })();

var Elem = function Elem(string) {
  return new CreateElement(string);
};
