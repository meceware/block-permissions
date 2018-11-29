import moment from 'moment';

const attributes = {
	showORhide: {
		type: 'string',
		default: '',
	},
	showORhidePermission: {
		type: 'string',
		default: '',
	},
	userRoles: {
		type: 'string',
		default: '',
	},
	users: {
		type: 'string',
		default: '',
	},
	devices: {
		type: 'string',
		default: JSON.stringify({desktops: false, tablets: false, phones: false}),
	},
	dateRange: {
		type: 'string',
		default: JSON.stringify({start: moment().format('YYYY/MM/DD HH:mm'), end: moment().format('YYYY/MM/DD HH:mm')}),
	},
	timeRange: {
		type: 'string',
		default: JSON.stringify({start: moment("00:00", "HH:mm").format('HH:mm'), end: moment("18:00", "HH:mm").format('HH:mm')}),
	},
	dayOfWeek: {
		type: 'string',
		default: '',
	},
	phpFunc: {
		type: 'string',
		default: '',
  },
  containerTag: {
		type: 'string',
		default: '',
  },
  containerClass: {
		type: 'string',
		default: '',
	},
};
export default attributes;
