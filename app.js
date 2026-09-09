const form = document.querySelector('#lensForm');
const resultsSection = document.querySelector('#results');
const primaryResults = document.querySelector('#primaryResults');
const secondResults = document.querySelector('#secondResults');

const icons = {
  reflection: '✦',
  near: '⌕',
  progressive: '↔',
  driving: '◇',
  sun: '☀',
  reading: '▤',
  safety: '◇',
  backup: '＋'
};

function isChecked(id) {
  return document.querySelector(`#${id}`).checked;
}

function valueOf(id) {
  return document.querySelector(`#${id}`).value;
}

function addRecommendation(list, title, icon, reason) {
  const existing = list.find((item) => item.title === title);

  if (existing) {
    if (reason && !existing.reasons.includes(reason)) {
      existing.reasons.push(reason);
    }

    return;
  }

  list.push({
    title,
    icon,
    reasons: reason ? [reason] : []
  });
}

function createRecommendations() {
  const primary = [];
  const second = [];

  const computerTime = valueOf('computerTime');
  const phoneTime = valueOf('phoneTime');
  const drivingTime = valueOf('drivingTime');
  const nightDriving = valueOf('nightDriving');
  const workEnv = valueOf('workEnv');

  const heavyComputerUse =
    ['6-8', '9+'].includes(computerTime) ||
    isChecked('taskComputer');

  const heavyPhoneUse =
    ['6-8', '9+'].includes(phoneTime);

  const longerDriving =
    ['1-2', '2+'].includes(drivingTime);

  const regularNightDriving =
    ['sometimes', 'often'].includes(nightDriving);

  const sunOrGlareActivity =
    workEnv === 'outdoor' ||
    isChecked('taskOutdoor') ||
    isChecked('hobOutdoor') ||
    isChecked('hobWaterSnow');

  const safetyActivity =
    workEnv === 'trades' ||
    isChecked('taskSafety') ||
    isChecked('taskDirty') ||
    isChecked('hobDIY');

  const readingActivity =
    isChecked('hobReading') ||
    isChecked('spReaders');

  if (heavyComputerUse) {
    addRecommendation(
      primary,
      'Anti-reflective treatment',
      icons.reflection,
      'Helps manage reflections during frequent computer use.'
    );
  }

  if (heavyPhoneUse) {
    addRecommendation(
      primary,
      'Comfort-focused near and intermediate vision',
      icons.near,
      'Supports frequent phone and close-range viewing.'
    );
  }

  if (isChecked('taskNearDetail')) {
    addRecommendation(
      primary,
      'Strong near-vision support',
      icons.near,
      'Supports detailed close work and small visual tasks.'
    );
  }

  if (isChecked('taskDistanceChanges')) {
    addRecommendation(
      primary,
      'Premium progressive discussion',
      icons.progressive,
      'May provide a wider, sharper viewing experience across changing distances.'
    );
  }

  if (
    longerDriving ||
    workEnv === 'driving' ||
    isChecked('hobDrivingTravel')
  ) {
    addRecommendation(
      primary,
      'Distance and driving-focused lens discussion',
      icons.driving,
      'Supports extended distance viewing and time behind the wheel.'
    );
  }

  if (regularNightDriving) {
    addRecommendation(
      primary,
      'Anti-reflective treatment',
      icons.reflection,
      'Helps reduce distracting headlight reflections during night driving.'
    );
  }

  if (sunOrGlareActivity) {
    addRecommendation(
      primary,
      'Dedicated sunglasses',
      icons.sun,
      'Provides comfort for regular sun and glare exposure.'
    );
  }

  if (readingActivity) {
    addRecommendation(
      second,
      'Reading-only second pair',
      icons.reading,
      'Offers focused comfort for longer reading or craft sessions.'
    );
  }

  if (safetyActivity) {
    addRecommendation(
      second,
      'Safety-focused second pair',
      icons.safety,
      'Better suited to a hard-use, dusty or impact-risk environment.'
    );
  }

  if (isChecked('spBackup')) {
    addRecommendation(
      second,
      'Backup pair',
      icons.backup,
      'Provides an extra pair when the primary pair is unavailable.'
    );
  }

  if (isChecked('spSunglasses') || sunOrGlareActivity) {
    addRecommendation(
      second,
      'Sunglasses second pair',
      icons.sun,
      'Provides dedicated comfort and protection in bright outdoor conditions.'
    );
  }

  return {
    primary,
    second
  };
}

function renderList(container, recommendations, emptyText) {
  container.replaceChildren();

  if (!recommendations.length) {
    const message = document.createElement('p');

    message.className = 'empty-message';
    message.textContent = emptyText;

    container.append(message);
    return;
  }

  recommendations.forEach((recommendation) => {
    const card = document.createElement('article');
    card.className = 'recommendation';

    const icon = document.createElement('div');
    icon.className = 'recommendation-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = recommendation.icon;

    const copy = document.createElement('div');

    const title = document.createElement('h4');
    title.textContent = recommendation.title;

    const reason = document.createElement('p');
    reason.textContent = recommendation.reasons.join(' ');

    copy.append(title, reason);
    card.append(icon, copy);
    container.append(card);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const recommendations = createRecommendations();

  const hasAny =
    recommendations.primary.length ||
    recommendations.second.length;

  renderList(
    primaryResults,
    recommendations.primary,
    hasAny
      ? 'No primary-pair recommendation was triggered.'
      : 'Select additional activities to generate recommendations.'
  );

  renderList(
    secondResults,
    recommendations.second,
    hasAny
      ? 'No second-pair recommendation was triggered.'
      : 'Select additional activities to generate recommendations.'
  );

  resultsSection.hidden = false;

  if (window.matchMedia('(max-width: 900px)').matches) {
    resultsSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
});

form.addEventListener('reset', () => {
  resultsSection.hidden = true;
  primaryResults.replaceChildren();
  secondResults.replaceChildren();
});