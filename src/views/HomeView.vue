<template>
  <div class="dashboard">
    <header class="hero">
      <h1 class="gradient-title">{{ $t('home.title') }}</h1>
      <p class="subtitle">{{ $t('home.subtitle') }}</p>
      <p class="full-description">{{ $t('home.description') }}</p>
    </header>
    
    <div class="tool-grid">
      <router-link to="/password" class="tool-card">
        <div class="icon-wrapper purple">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h3>{{ $t('home.tools.password.title') }}</h3>
        <p>{{ $t('home.tools.password.desc') }}</p>
      </router-link>

      <router-link to="/cron" class="tool-card">
        <div class="icon-wrapper green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <h3>{{ $t('home.tools.cron.title') }}</h3>
        <p>{{ $t('home.tools.cron.desc') }}</p>
      </router-link>

      <router-link to="/json" class="tool-card">
        <div class="icon-wrapper blue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
        <h3>{{ $t('home.tools.json.title') }}</h3>
        <p>{{ $t('home.tools.json.desc') }}</p>
      </router-link>

      <router-link to="/crypto" class="tool-card">
        <div class="icon-wrapper teal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            <circle cx="12" cy="16" r="1"></circle>
          </svg>
        </div>
        <h3>{{ $t('home.tools.crypto.title') }}</h3>
        <p>{{ $t('home.tools.crypto.desc') }}</p>
      </router-link>

      <router-link to="/jwt" class="tool-card">
        <div class="icon-wrapper indigo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <h3>{{ $t('home.tools.jwt.title') }}</h3>
        <p>{{ $t('home.tools.jwt.desc') }}</p>
      </router-link>

      <router-link to="/timestamp" class="tool-card">
        <div class="icon-wrapper orange">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
          </svg>
        </div>
        <h3>{{ $t('home.tools.timestamp.title') }}</h3>
        <p>{{ $t('home.tools.timestamp.desc') }}</p>
      </router-link>

      <router-link to="/regex" class="tool-card">
        <div class="icon-wrapper rose">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        </div>
        <h3>{{ $t('home.tools.regex.title') }}</h3>
        <p>{{ $t('home.tools.regex.desc') }}</p>
      </router-link>

      <router-link to="/strings" class="tool-card">
        <div class="icon-wrapper cobalt">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h3>{{ $t('home.tools.strings.title') }}</h3>
        <p>{{ $t('home.tools.strings.desc') }}</p>
      </router-link>

      <router-link to="/colors" class="tool-card">
        <div class="icon-wrapper slate">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
          </svg>
        </div>
        <h3>{{ $t('home.tools.colors.title') }}</h3>
        <p>{{ $t('home.tools.colors.desc') }}</p>
      </router-link>

      <router-link to="/diff" class="tool-card">
        <div class="icon-wrapper orange">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </div>
        <h3>{{ $t('home.tools.diff.title') }}</h3>
        <p>{{ $t('home.tools.diff.desc') }}</p>
      </router-link>

      <router-link to="/image-base64" class="tool-card">
        <div class="icon-wrapper sky">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
        <h3>{{ $t('home.tools.image.title') }}</h3>
        <p>{{ $t('home.tools.image.desc') }}</p>
      </router-link>

      <router-link to="/config-convert" class="tool-card">
        <div class="icon-wrapper emerald">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <path d="M8 13h8"></path>
            <path d="M8 17h8"></path>
            <path d="M10 9H8"></path>
          </svg>
        </div>
        <h3>{{ $t('home.tools.config.title') }}</h3>
        <p>{{ $t('home.tools.config.desc') }}</p>
      </router-link>

      <router-link to="/sql-format" class="tool-card">
        <div class="icon-wrapper amber">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
          </svg>
        </div>
        <h3>{{ $t('home.tools.sql.title') }}</h3>
        <p>{{ $t('home.tools.sql.desc') }}</p>
      </router-link>

      <router-link to="/unit-convert" class="tool-card">
        <div class="icon-wrapper rose">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11"></path>
            <path d="M21 7V5a2 2 0 0 0-2-2h-2"></path>
            <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
            <path d="M13 3v18"></path>
          </svg>
        </div>
        <h3>{{ $t('home.tools.unit.title') }}</h3>
        <p>{{ $t('home.tools.unit.desc') }}</p>
      </router-link>

      <router-link to="/url-parse" class="tool-card">
        <div class="icon-wrapper cobalt">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </div>
        <h3>{{ $t('home.tools.url.title') }}</h3>
        <p>{{ $t('home.tools.url.desc') }}</p>
      </router-link>

      <router-link to="/qrcode" class="tool-card">
        <div class="icon-wrapper slate">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
            <line x1="7" y1="7" x2="7" y2="7"></line>
            <line x1="17" y1="7" x2="17" y2="7"></line>
            <line x1="7" y1="17" x2="7" y2="17"></line>
            <line x1="17" y1="17" x2="17" y2="17"></line>
          </svg>
        </div>
        <h3>{{ $t('home.tools.qrcode.title') }}</h3>
        <p>{{ $t('home.tools.qrcode.desc') }}</p>
      </router-link>

      <router-link to="/markdown" class="tool-card">
        <div class="icon-wrapper dark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </div>
        <h3>{{ $t('home.tools.markdown.title') }}</h3>
        <p>{{ $t('home.tools.markdown.desc') }}</p>
      </router-link>

      <router-link to="/ua" class="tool-card">
        <div class="icon-wrapper red">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </div>
        <h3>{{ $t('home.tools.ua.title') }}</h3>
        <p>{{ $t('home.tools.ua.desc') }}</p>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 30px 20px;
}

.hero {
  max-width: 800px;
  margin: 0 auto 40px;
  text-align: center;
}

.gradient-title {
  font-size: 2.2rem;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #7c4dff, #4caf50);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 10px;
  font-weight: 500;
}

.full-description {
  color: #95a5a6;
  font-size: 0.9rem;
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.6;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 1100px;
  margin: 0 auto;
}

.tool-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
  border: 1px solid rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  border-color: #7c4dff;
}

.icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: white;
}

.icon-wrapper.purple { background: #7c4dff; }
.icon-wrapper.dark { background: #333; }
.icon-wrapper.green { background: #00b894; }
.icon-wrapper.red { background: #ff7675; }
.icon-wrapper.blue { background: #3498db; }
.icon-wrapper.purple { background: #6c5ce7; }
.icon-wrapper.pink { background: #fd79a8; }
.icon-wrapper.teal { background: #00cec9; }
.icon-wrapper.indigo { background: #a29bfe; }
.icon-wrapper.orange { background: #ff9f43; }
.icon-wrapper.sky { background: #0fbcf9; }
.icon-wrapper.emerald { background: #05c46b; }
.icon-wrapper.amber { background: #ffc048; }
.icon-wrapper.rose { background: #ef5777; }
.icon-wrapper.cobalt { background: #3c40c6; }
.icon-wrapper.slate { background: #485460; }

.icon-wrapper svg {
  width: 16px;
  height: 16px;
}

h3 {
  font-size: 1.1rem;
  margin-bottom: 8px;
}

p {
  color: #777;
  line-height: 1.4;
  font-size: 0.85rem;
}
</style>
