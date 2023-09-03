import dev from './config.dev'
import pro from './config.pro'

let config

if(process.env.NODE_ENV === "development") {
    config = dev
} else if(process.env.NODE_ENV === "production") {
    config = pro
}

export default config