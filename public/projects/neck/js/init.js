(function () {
    'use strict'

    // init Tooltips
    document.querySelectorAll('html').forEach(function (tooltip) {
        new bootstrap.Tooltip(tooltip, {
            selector: '[data-bs-toggle="tooltip"]'
        });
    });

    document.querySelectorAll('[data-bs-toggle="popover"]').forEach(function (popover) {
        new bootstrap.Popover(popover);
    });

    // init toasts
    document.querySelectorAll('.toast').forEach(function (toastNode) {
        const toast = new bootstrap.Toast(toastNode, {
            autohide: false
        });
        toast.show();
    });

    // Disable empty links
    document.querySelectorAll('[href="#"]').forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
        });
    });

    window.addEventListener('resize', () => {
        resize();
    });
    resize();

    // Wähle das Verschiebewerkzeug als Standardtool
    setTool('move');
})();