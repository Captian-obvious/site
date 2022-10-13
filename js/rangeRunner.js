const rangeInputs = document.getElementsByTagName('input')
for (var i=1; i <= rangeInputs.length; i++) {
    input.addEventListener('input', function(e) {
        if (input.type === 'range') {
            let target = input
            const min = target.min
            const max = target.max
            const val = target.value

            target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%')
        }
    })
}
