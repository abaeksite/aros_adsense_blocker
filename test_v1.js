let isInterstitialAdActive = false; // 전면 광고가 활성화된 상태를 추적

// 현재 <script> 태그에서 data-redirect-url 읽기
function getRedirectUrl() {
  const scripts = document.getElementsByTagName('script');
  const thisScript = scripts[scripts.length - 1]; // 마지막 <script>가 현재 스크립트
  return thisScript.getAttribute('data-redirect-url') || "https://aros100.com";
}

// 전면 광고인지 확인
function isInterstitialAd(element) {
  return element && (element.tagName === 'IFRAME' && element.src.includes('google')) ||
         (element.classList && element.classList.contains('adsbygoogle-interstitial'));
}

// 블러 처리된 배경을 클릭했는지 확인
function isBlurBackground(element) {
  return element && element.classList && element.classList.contains('blur-background');
}

// 애드센스 광고인지 확인
function isAdsenseAd(element) {
  if (element && element.tagName === 'IFRAME' && element.src && element.src.includes('google')) {
    return true;
  }
  if (element && element.tagName === 'INS' && element.getAttribute('data-ad-client') && element.getAttribute('data-ad-client').includes('pub-')) {
    return true;
  }
  return false;
}

// 클릭 횟수 카운트
function addClickCount() {
  let clickCount = localStorage.getItem("adsenseClickCount") ? parseInt(localStorage.getItem("adsenseClickCount")) : 0;

  if (clickCount <= 2) {
    clickCount++;
    localStorage.setItem("adsenseClickCount", clickCount.toString());
  }

  if (clickCount > 2) {
    const userConfirmed = confirm(
      '애드센스 연속 클릭 3회 진행하셨기에 무효트래픽 공격으로 간주하여 IP 추적 진행합니다. 악의적인 광고 클릭 멈추시겠습니까?\n\n제작자: 아로스(국내 1위 수익형 블로그 강사)'
    );

    if (!userConfirmed) {
      const redirectUrl = getRedirectUrl(); // 사용자 지정 URL로 이동
      window.location.replace(redirectUrl);
    }

    localStorage.setItem("adsenseClickCount", '0');
  }
}

// 전면 광고 감지
window.addEventListener('focus', function () {
  const activeElement = document.activeElement;
  if (isInterstitialAd(activeElement)) {
    isInterstitialAdActive = true;
    console.log("전면 광고가 활성화되었습니다.");
  } else {
    isInterstitialAdActive = false;
  }
});

// 광고 클릭 감지
window.addEventListener('blur', function () {
  const activeElement = document.activeElement;

  if (isInterstitialAdActive) {
    console.log("전면 광고 활성화 중 blur 발생. 클릭 무시.");
    return;
  }

  if (isBlurBackground(activeElement)) {
    console.log("블러 배경 클릭 감지. 클릭 무시.");
    return;
  }

  if (isAdsenseAd(activeElement)) {
    if (window.location.href.includes('#google_vignette')) {
      return;
    }

    addClickCount();

    setTimeout(function () {
      activeElement.blur();
    }, 1);
  }
});
