let animation = bodymovin.loadAnimation({
    container: document.getElementById('glitchAnimation'),
    path: '/static/lottie/glitchAnimation.json',
    render: 'svg',
    loop: true,
    autoplay: true,
    name: 'animation name'
})