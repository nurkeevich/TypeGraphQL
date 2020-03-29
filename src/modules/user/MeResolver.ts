import { Resolver, Query, Ctx, UseMiddleware } from "type-graphql";
import User from "../../entity/User";
import MyContext from "../../types/MyContext";
import isAuth from "../../middleware/isAuth";
import logger from "../../middleware/logger";

@Resolver()
class MeResolver {
    @UseMiddleware(isAuth, logger) // Add more custome middlewares if needed => Ex: @UserMiddleware(isAuth, logger, isAdmin, ...)
    @Query(() => User, { nullable: true })
    async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
        if (!ctx.req.session!.userId) {
            return undefined;
        }

        return User.findOne(ctx.req.session!.userId);
    }
}

export default MeResolver;
