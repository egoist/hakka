import { Args, Mutation, Resolver } from 'type-graphql'

@Resolver()
export class AuthResolver {
  @Mutation((returns) => Boolean)
  async signup() {
    // TODO
  }

  @Mutation((returns) => Boolean)
  async login() {
    // TODO
  }
}
