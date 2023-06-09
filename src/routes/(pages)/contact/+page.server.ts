export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // console.log({name, email, message})

        const prefilledLink = `https://docs.google.com/forms/d/e/1FAIpQLScE5KZ8RjaT1vkVpyjQqyQssE33fn3l6yQuhZSgG3Pf_XSD2g/formResponse?usp=pp_url&entry.1140151499=${name}&entry.693810549=${email}&entry.1370967559=${message}&submit=Submit`

        const resp = await fetch(prefilledLink)
        console.log(resp)

        return {
            success: true,
            message: 'Thank you for your message!',
        }
    }
}