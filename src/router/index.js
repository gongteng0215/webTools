import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PasswordGenerator from '../views/PasswordGenerator.vue'
import CronGenerator from '../views/CronGenerator.vue'
import JsonFormatter from '../views/JsonFormatter.vue'
import CryptoTool from '../views/CryptoTool.vue'
import JwtTool from '../views/JwtTool.vue'
import TimestampConverter from '../views/TimestampConverter.vue'
import RegexTester from '../views/RegexTester.vue'
import StringTools from '../views/StringTools.vue'
import ColorPalette from '../views/ColorPalette.vue'
import DiffChecker from '../views/DiffChecker.vue'
import ImageBase64 from '../views/ImageBase64.vue'
import ConfigConverter from '../views/ConfigConverter.vue'
import SqlFormatter from '../views/SqlFormatter.vue'
import UnitConverter from '../views/UnitConverter.vue'
import UrlParser from '../views/UrlParser.vue'
import QrCodeGenerator from '../views/QrCodeGenerator.vue'
import MarkdownPreview from '../views/MarkdownPreview.vue'
import UAParser from '../views/UAParser.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/password', component: PasswordGenerator },
    { path: '/cron', component: CronGenerator },
    { path: '/json', component: JsonFormatter },
    { path: '/crypto', component: CryptoTool },
    { path: '/jwt', component: JwtTool },
    { path: '/timestamp', component: TimestampConverter },
    { path: '/regex', component: RegexTester },
    { path: '/strings', component: StringTools },
    { path: '/colors', component: ColorPalette },
    { path: '/diff', component: DiffChecker },
    { path: '/image-base64', component: ImageBase64 },
    { path: '/config-convert', component: ConfigConverter },
    { path: '/sql-format', component: SqlFormatter },
    { path: '/unit-convert', component: UnitConverter },
    { path: '/url-parse', component: UrlParser },
    { path: '/qrcode', component: QrCodeGenerator },
    { path: '/markdown', component: MarkdownPreview },
    { path: '/ua', component: UAParser }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
