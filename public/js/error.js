let animation = bodymovin.loadAnimation({
    container: document.getElementById('errorAnimation'),
    path: '/static/lottie/errorAnimation.json',
    render: 'svg',
    loop: true,
    autoplay: true,
    name: 'animation name'
})