import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../services/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
	// client-side

	return (
		<Provider store={store}>
			<div>
				<Component {...pageProps} />
				<ToastContainer />
			</div>
		</Provider>
	);
}
