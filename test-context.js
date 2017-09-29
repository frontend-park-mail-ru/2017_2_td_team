let context = require.context('./spec', true, /[sS]pec\.js$/);
context.keys().forEach(context);
