import { initializeApp, getApps, getApp, cert, type ServiceAccount } from "firebase-admin/app";

export default defineNitroPlugin((nitroApp) => {
	// Import the functions you need from the SDKs you need
	// TODO: Add SDKs for Firebase products that you want to use
	// https://firebase.google.com/docs/web/setup#available-libraries

	const { public: config } = useRuntimeConfig();

	const serviceAccount: ServiceAccount = {
		"projectId": "anonaddress",
		"privateKey": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCh6Zc19LeQOdn6\nZPKYcWpXd93yZSEfTCb30FdEW62H0/tNIrXUjUHWuoIJrTUJZIzWSOQWGIeeAMHI\nrlnnElKPWb341fk3mljTYEBb5jEsSexFj15voOD0uF2QW+lyCvVnfPPEdvFo0aqm\n3iNL1ypUsMJfGi/gd9gmHwQN6vBKOlVl4gMlRrGUnFY7M3vavH9dVG7bjd9Yx4Rl\ntOvc8EEF33Rjck5MvgEmsfaNUoItA6rex0bqHyVuF4uX3skrsEbmxVqG50eDEhkp\ntCqN+ksuhgtfpIsJETPWs/cheethq5wXgkD0meaJA42cG3/MuHDL5iG63r6iXPFi\nGM0lMzzdAgMBAAECggEAGtZsQP5KOvbL4cw/xfLurIbq3BXVMqndv6/h9yu3DM+f\nVP7O4udzJVOO4Gm8Y80t5wr3+42fVRpNBKWZs0p/MtGuQoO9JnFIDeljYZg7SFsM\ndc842Qnyn727jIUfoc6dNMUqZsNMapJuVfB2K0kD9DvETB08GFnlExSLCH+LytGy\n+PmF62BlQQXlfYcxu4JVgHp6beU1qUhnGx9QCbGo1m4M7okL+XsUlKEWhBR5VMaG\nYlQBHxd3fVc/d86tZWaoSTo3+i3PqGjJ+tUrS1u7LZtE3qPeHiIa7WiFDoP20qx3\nRoIUnul5f+n1rQ0pXff9DbUwDN+3tnOYoguA9j0ahQKBgQDQdC26vpM9wa7eQoQy\nyUlZCokCYrrCT7eXXUN5w3WkyPMSPC8oYcWGRINNBq6jSTvH/KwsdVKmTjHh+fOy\ndPA6ew/lGaC75mDHJqfJLOueEdV07LjVUapLkfybbz5mUwZw9LDzQYlO18VnNC49\n1UTUpZAAHfpga5FuWStxb4hSfwKBgQDG19EbWEtqjXNoMhNvjw5nXuJzOgd258kB\nhfJxiKXjkiQ6E7PskZsuCnb7yq0TS5HkayJl9c9hq9z4nA2bxFi91H73/3xHvHMM\nmD4gLrgg3IgvFuyidnjE4ibWzi56ynYVmNo7aYkx4IeFeM3VgwChOUEjtXQbtMXU\nlR6Wg3JKowKBgQCaaRTeugCTxH7mQNtwS0472OP4km3JNgfG5dzvu2vPrtLvdQlx\nnksU1Hd2fTar2bmgwHhBTn70lgO5Ys+0J48zoqj5iexYg6S4oNe028OFCazWueuI\niL/ezrsR4GuWnHWvAnJ5Hti5QHgHpM2EHBCqfCGZFJu9BLFrzj2x/245vQKBgDQp\nWUl7GA2TnbqvqDmTpYuocG8ZweuHUkt7/+WYmyvfonE5yfE9ISAqzpuux0hQgq0R\nDa0Blq1gkE8HYOqDz2O84rHb65ZF8UhUh7eZiePU9kSkFt9nhLbhPJ8M51R+2AtC\nVb1QKhVTeTmiPxzLiNbCVjwv1Y2PFnZ1x9hkEw9RAoGATzEzPb7gt6QxVZKpQssK\nWRk2KQv47UL60sdzV4gvGDVs2dlpy8OZK9k9Urzj95WP3TMmtNFEm9NgYE8mWwiz\nvvnnu9Zfdv4hRXSNzRIz/1/ICcNz6WzLkEPsNxmDjfJNqAWV4LYyGs89ZCdICINP\nO8aVFGHKm6YhCiPKv0QSzv8=\n-----END PRIVATE KEY-----\n",
		"clientEmail": "firebase-adminsdk-pn6hn@anonaddress.iam.gserviceaccount.com"
	}

	// Your web app's Firebase configuration
	const firebaseConfig = {
		credential: cert(serviceAccount),
		databaseURL: config.firebaseDatabaseURL
	};

	// Return a new instance of the firebase app or the cached instance
	// @ts-ignore
	nitroApp.firebaseServerApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
	console.log("loaded");
});