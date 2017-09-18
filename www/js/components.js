

function createInputForm(inputs, buttons = [], classes = []) {
  const form = document.createElement('form');
  form.setAttribute('action', '');
  classes.forEach(className => form.classList.add(className));

  const appendInputBlock = elem => form.appendChild(
    createInputBlock(
      createLabel(elem[2], elem[0]),
      createInput(elem[1], elem[2]),
    ));
  inputs.forEach(appendInputBlock);
  buttons.forEach(elem => form.appendChild(elem));
  return form;
}


function createInputBlock(label, input) {
  const inputBlock = document.createElement('div');
  inputBlock.classList.add('input-block');
  inputBlock.appendChild(label);
  inputBlock.appendChild(input);
  return inputBlock;
}

function createLabel(labelFor, labelText) {
  const label = document.createElement('label');
  label.innerText = labelText;
  label.setAttribute('for', labelFor);
  return label;
}

function createButton(buttonScheme) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.innerText = buttonScheme[0];

  buttonScheme[1].forEach(className => button.classList.add(className));
  button.classList.add('button');

  button.addEventListener('click', buttonScheme[2]);
  return button;
}

function createInput(type, name, classes = []) {
  const input = document.createElement('input');
  input.setAttribute('type', type);
  input.setAttribute('name', name);
  classes.forEach(className => input.classList.add(className));
  return input;
}

