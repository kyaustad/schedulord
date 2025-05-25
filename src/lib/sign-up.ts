import { authClient } from "@/lib/auth-client"; //import the auth client

export const signUp = async (
	email: string,
	password: string,
	name: string,
	image: string,
	callbackURL: string,
	role: string,
	first_name: string,
	last_name: string
) => {
	try {
		const { data, error } = await authClient.signUp.email(
			{
				email, // user email address
				password, // user password -> min 8 characters by default
				name, // user display name
				image, // User image URL (optional)
				callbackURL: "/dashboard", // A URL to redirect to after the user verifies their email (optional)
				role,
				first_name,
				last_name,
			},
			{
				onRequest: (ctx) => {
					//show loading
				},
				onSuccess: (ctx) => {
					//redirect to the dashboard or sign in page
				},
				onError: (ctx) => {
					// display the error message
					alert(ctx.error.message);
				},
			}
		);
		return { data, error };
	} catch (error) {
		console.error("Sign up error:", error);
		throw error;
	}
};
