import {withAuth} from "@workos-inc/authkit-nextjs";

export const getWorkOsUser = async () => (await withAuth({ensureSignedIn: true})).user;