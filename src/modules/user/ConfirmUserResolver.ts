import { Mutation, Resolver, Arg } from "type-graphql";
import { redis } from "../../redis";
import User from "../../entity/User";
import { Prefixes } from "../../constants/constants";

@Resolver()
class ConfirmUserResolver {
    @Mutation(() => Boolean)
    async confirmUser(@Arg("token") token: string): Promise<boolean> {
        const userId = await redis.get(Prefixes.confirmUser + token);

        if (!userId) {
            return false;
        }

        await User.update({ id: parseInt(userId, 10) }, { confirmed: true });
        await redis.del(Prefixes.confirmUser + token);

        return true;
    }
}

export default ConfirmUserResolver;
