export interface iUser {
	_id: string;
	name: string;
	lastname: string;
	token: string;
}

export interface iUserLoginInput {
	username: string;
	password: string;
}

export interface iUserSignupInput {
	name: string;
	lastname: string;
	email: string;
	password: string;
	username: string;
}

export interface iUserInput {
	name: string;
	lastname: string;
	email: string;
	password?: string;
	username: string;
}

export interface iUsersIDMessage {
	sender?: string;
	receiver: string;
}

export interface iThunkAPIUser {
	auth: {
		user: {
			mail: string;
			lastname: string;
			name: string;
			token: string;
			username: string;
			_id: string;
		};
		errorMessage: string;
		isError: boolean;
		isLoading: boolean;
		isSuccess: boolean;
	};
	messages: {
		messages: [];
		errorMessage: string;
		isError: boolean;
		isLoading: boolean;
		isSuccess: boolean;
	};
}
