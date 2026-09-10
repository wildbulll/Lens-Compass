const form = document.querySelector('#lensForm');
const resultsSection = document.querySelector('#results');
const multifocalResults = document.querySelector(
  '#multifocalResults'
);
const primaryResults = document.querySelector(
  '#primaryResults'
);
const secondResults = document.querySelector(
  '#secondResults'
);

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

function addRecommendation(
  list,
  title,
  icon,
  reason
) {
  const existing = list.find(
    (item) => item.title === title
  );

  if (existing) {
    if (
      reason &&
      !existing.reasons.includes(reason)
    ) {
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
    ['sometimes', 'often'].includes(
      nightDriving
    );

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
      'Wider-view progressive discussion',
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

  if (
    isChecked('spSunglasses') ||
    sunOrGlareActivity
  ) {
    addRecommendation(
      second,
      'Sunglasses second pair',
      icons.sun,
      'Provides dedicated comfort in bright outdoor conditions.'
    );
  }

  return {
    primary,
    second
  };
}

function createMultifocalRecommendations() {
  const addPower = Number(valueOf('addPower'));
  const currentLenses = valueOf(
    'currentLenses'
  );
  const lensExperience = valueOf(
    'lensExperience'
  );

  if (
    isChecked('rxUnavailable') ||
    !addPower
  ) {
    return [];
  }

  let progressiveScore = 0;
  let bifocalScore = 0;

  const progressiveReasons = [];
  const bifocalReasons = [];

  const frequentComputerUse =
    ['6-8', '9+'].includes(
      valueOf('computerTime')
    ) ||
    isChecked('taskComputer');

  if (frequentComputerUse) {
    progressiveScore += 2;

    progressiveReasons.push(
      'Intermediate vision matters for frequent computer use.'
    );
  }

  if (isChecked('taskDistanceChanges')) {
    progressiveScore += 2;

    progressiveReasons.push(
      'The customer regularly changes viewing distance.'
    );
  }

  if (
    currentLenses === 'progressive' &&
    lensExperience === 'well'
  ) {
    progressiveScore += 4;

    progressiveReasons.push(
      'Their current progressive lenses are working well.'
    );
  }

  if (
    currentLenses === 'bifocal' &&
    lensExperience === 'well'
  ) {
    bifocalScore += 4;

    bifocalReasons.push(
      'Their current lined bifocals are working well.'
    );
  }

  if (
    isChecked('taskNearDetail') ||
    isChecked('hobReading')
  ) {
    bifocalScore += 1;

    bifocalReasons.push(
      'A defined near area may support extended close work.'
    );
  }

  if (!progressiveReasons.length) {
    progressiveReasons.push(
      'Provides near, intermediate and distance viewing without a visible line.'
    );
  }

  if (!bifocalReasons.length) {
    bifocalReasons.push(
      'Provides clearly separated distance and near viewing areas.'
    );
  }

  const progressiveIsBest =
    progressiveScore >= bifocalScore;

  const recommendations = [
    {
      title: 'Progressive lenses',
      icon: icons.progressive,
      reasons: progressiveReasons,
      highlighted: progressiveIsBest
    },
    {
      title: 'Lined bifocal',
      icon: icons.reading,
      reasons: bifocalReasons,
      highlighted: !progressiveIsBest
    }
  ];

  return recommendations.sort(
    (first, second) =>
      Number(second.highlighted) -
      Number(first.highlighted)
  );
}

function renderList(
  container,
  recommendations,
  emptyText
) {
  container.replaceChildren();

  if (!recommendations.length) {
    const message =
      document.createElement('p');

    message.className = 'empty-message';
    message.textContent = emptyText;

    container.append(message);
    return;
  }

  recommendations.forEach(
    (recommendation) => {
      const card =
        document.createElement('article');

      card.className = 'recommendation';

      const icon =
        document.createElement('div');

      icon.className = 'recommendation-icon';
      icon.setAttribute(
        'aria-hidden',
        'true'
      );
      icon.textContent =
        recommendation.icon;

      const copy =
        document.createElement('div');

      if (
        Object.hasOwn(
          recommendation,
          'highlighted'
        )
      ) {
        const fitLabel =
          document.createElement('span');

        fitLabel.className = 'fit-label';

        fitLabel.textContent =
          recommendation.highlighted
            ? 'Best lifestyle fit'
            : 'Also discuss';

        copy.append(fitLabel);

        if (!recommendation.highlighted) {
          card.classList.add(
            'recommendation--secondary'
          );
        }
      }

      const title =
        document.createElement('h4');

      title.textContent =
        recommendation.title;

      const reason =
        document.createElement('p');

      reason.textContent =
        recommendation.reasons.join(' ');

      copy.append(title, reason);
      card.append(icon, copy);
      container.append(card);
    }
  );
}

form.addEventListener(
  'submit',
  (event) => {
    event.preventDefault();

    const recommendations =
      createRecommendations();

    const multifocalRecommendations =
      createMultifocalRecommendations();

    const hasAny =
      recommendations.primary.length ||
      recommendations.second.length ||
      multifocalRecommendations.length;

    renderList(
      multifocalResults,
      multifocalRecommendations,
      isChecked('rxUnavailable')
        ? 'Prescription not available—use the lifestyle recommendations below.'
        : 'Enter an ADD value to begin a progressive and lined-bifocal conversation.'
    );

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

    if (
      window.matchMedia(
        '(max-width: 900px)'
      ).matches
    ) {
      resultsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
);

form.addEventListener('reset', () => {
  resultsSection.hidden = true;

  multifocalResults.replaceChildren();
  primaryResults.replaceChildren();
  secondResults.replaceChildren();

  document
    .querySelectorAll(
      '.rx-section input, .rx-section select'
    )
    .forEach((control) => {
      control.disabled = false;
    });

  document
    .querySelectorAll('.axis-input')
    .forEach((axis) => {
      axis.disabled = true;
    });
});

document
  .querySelectorAll('.cylinder-input')
  .forEach((input) => {
    input.addEventListener('input', () => {
      const axis =
        document.querySelector(
          input.id === 'odCylinder'
            ? '#odAxis'
            : '#osAxis'
        );

      axis.disabled = !Number(input.value);

      if (axis.disabled) {
        axis.value = '';
      }
    });
  });

document
  .querySelector('#rxUnavailable')
  .addEventListener(
    'change',
    (event) => {
      document
        .querySelectorAll(
          '.rx-section input:not(#rxUnavailable), .rx-section select'
        )
        .forEach((control) => {
          control.disabled =
            event.target.checked;
        });
    }
  );