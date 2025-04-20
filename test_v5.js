let isInterstitialAdActive = false;

// redirect URL을 window 변수에서 가져오고, 없으면 기본값 사용
function getRedirectUrl() {
  return window.redirectTarget || "https://aros100.com";
}

// 전면 광고인지 확인
function isInterstitialAd(element) {
  return element && (element.tagName === 'IFRAME' && element.src.includes('google')) ||
         (element.classList && element.classList.contains('adsbygoogle-interstitial'));
}

// 블러 배경 클릭 여부
function isBlurBackground(element) {
  return element && element.classList && element.classList.contains('blur-background');
}

// 애드센스 광고인지 확인
function isAdsenseAd(element) {
  if (element && element.tagName === 'IFRAME' && element.src?.includes('google')) return true;
  if (element && element.tagName === 'INS' && element.getAttribute('data-ad-client')?.includes('pub-')) return true;
  return false;
}

// 클릭 횟수 카운트
function addClickCount() {
  let clickCount = parseInt(localStorage.getItem("adsenseClickCount") || "0");

  if (clickCount <= 2) {
    clickCount++;
    localStorage.setItem("adsenseClickCount", clickCount.toString());
  }

  if (clickCount > 2) {
    const userConfirmed = confirm(
      '애드센스 연속 클릭 3회 진행하셨기에 무효트래픽 공격으로 간주하여 IP 추적 진행합니다. 악의적인 광고 클릭 멈추시겠습니까?\n\n제작자: 아로스(국내 1위 수익형 블로그 강사)'
    );

    if (!userConfirmed) {
      const redirectUrl = getRedirectUrl();
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 100);
    }

    localStorage.setItem("adsenseClickCount", '0');
  }
}

// 전면 광고 감지
window.addEventListener('focus', () => {
  const activeElement = document.activeElement;
  isInterstitialAdActive = isInterstitialAd(activeElement);
});

// 광고 클릭 감지
window.addEventListener('blur', () => {
  const activeElement = document.activeElement;

  if (isInterstitialAdActive || isBlurBackground(activeElement)) return;

  if (isAdsenseAd(activeElement)) {
    if (!window.location.href.includes('#google_vignette')) {
      addClickCount();
    }

    setTimeout(() => activeElement.blur(), 1);
  }
});
