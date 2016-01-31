module.exports = {
	UNKNOWN: {
		message: 'An unknown error occurred.',
		status: 500
	},
	MISSING_KNEX_OPTION: {
		message: 'A knex property must be passed with your options.',
		status: 400
	},
	MISSING_VIEWPATH_OPTION: {
		message: 'A viewPath property must be passed with your options.',
		status: 400
	},
	ADDSUBSCRIBER_INVALID_TYPE_ARG: {
		message: 'A (string) type must be passed as the first argument to addSubscriber.',
		status: 400
	},
	ADDSUBSCRIBER_INVALID_KEY_ARG: {
		message: 'A (string) key must be passed as the second argument to addSubscriber.',
		status: 400
	},
	ADDSUBSCRIBER_INVALID_SUBSCRIPTIONS_ARG: {
		message: 'addSubscriber subscriptions argument must be an array of strings.',
		status: 400
	},
	GETSUBSCRIBERID_INVALID_FN_ARG: {
		message: 'A function must be passed as the first argument to getSubscriberId.',
		status: 400
	},
	GETSUBSCRIBERID_INVALID_ARGS: {
		message: 'Invalid type/key or subscriberId.',
		status: 400
	},
	DUPLICATE_SUBSCRIBER: {
		message: 'A subscriber with type "{{ type }}" and key "{{ key }}" already exists.',
		status: 409
	},
	DUPLICATE_SUBSCRIPTION: {
		message: '"{{ descriptor }}" already exists for subscriber {{ subscriberId }}.',
		status: 409
	},
	DUPLICATE_UNSUBSCRIPTION: {
		message: 'User has already unsubscribed from subscriptionId {{ subscriptionId }}.',
		status: 409
	},
	UNKNOWN_SUBSCRIBER_ID: {
		message: 'The subscriber id {{ subscriberId }} does not match an existing record.',
		status: 404
	},
	UNKNOWN_SUBSCRIBER: {
		message: 'There is no subscriber with a type of "{{ type }}" and a key of "{{ key }}".',
		status: 404
	},
	UNKNOWN_SUBSCRIPTION: {
		message: 'There is no subscription with a subscriberId of {{ subscriberId }} and descriptor "{{ descriptor }}".',
		status: 404
	},
	BAD_SUBSCRIPTION_DESCRIPTOR: {
		message: '"{{ descriptor }}" (type = {{ type }}) is not a valid subscription descriptor.',
		status: 400
	},
	MISSING_HANDLER: {
		message: 'There is no matching handler for the descriptor "{{ descriptor }}"',
		status: 404
	}
};