// Source - https://stackoverflow.com/a/51050139
// Posted by max-lt
// Retrieved 2026-05-06, License - CC BY-SA 4.0
import { IUserSession } from './utilities/types.js';

declare global {
    namespace Express {
        interface Locals {
            session: IUserSession;
        }
    }
}
