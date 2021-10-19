'use strict';

let errors = [];

function ValidationContract() {
    errors = [];
}

ValidationContract.prototype.isRequired = (value, message) => {
    if (!value || value.length <= 0)
        errors.push(message);
}

ValidationContract.prototype.hasMinLen = (value, min, message) => {
    if (!value || value.length < min)
        errors.push(message);
}

ValidationContract.prototype.hasMaxLen = (value, max, message) => {
    if (!value || value.length > max)
        errors.push(message);
}

ValidationContract.prototype.isFixedLen = (value, len, message) => {
    if (value.length != len)
        errors.push(message);
}

ValidationContract.prototype.isCpf = (value, message) => {
    const reg = new RegExp(/\d{3}\.?\d{3}\.?\d{3}-?\d{2}/);
    if (!reg.test(value))
        errors.push(message);
}

ValidationContract.prototype.isCnpj = (value, message) => {
    const reg = new RegExp(/\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}/);
    if (!reg.test(value))
        errors.push(message);
}

ValidationContract.prototype.isCpfOrCnpj = (value, message) => {
    let error = 0;
    const regCnpj = new RegExp(/\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}/);
    const regCpf = new RegExp(/\d{3}\.?\d{3}\.?\d{3}-?\d{2}/);
    
    if (!regCpf.test(value))
        error += 1;

    if (!regCnpj.test(value))
        error += 1;

    if (error == 0 || error == 2)
        errors.push(message);
}

ValidationContract.prototype.isEqualFields = (FirstValue, secondValue, message) => {
    if (FirstValue !== secondValue) errors.push(message);
}

ValidationContract.prototype.isPhoneNumber = (value, message) => {
    const reg = new RegExp(/\d{2} ?(\d{5})|(\d{4})-?\d{4}/);
    if (!reg.test(value))
        errors.push(message);
}

ValidationContract.prototype.isEmail = (value, message) => {
    const reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
    if (!reg.test(value))
        errors.push(message);
}

ValidationContract.prototype.isPassword = (value, message) => {
    const reg = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/);
    if (!reg.test(value))
        errors.push(message);
}

ValidationContract.prototype.errors = () => { 
    return errors; 
}

ValidationContract.prototype.clear = () => {
    errors = [];
}

ValidationContract.prototype.isValid = () => {
    return errors.length == 0;
}

module.exports = ValidationContract;