document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display confession count on load
    fetch('/confession_count')
        .then(resp => resp.json())
        .then(data => {
            if (data.count !== undefined) {
                document.getElementById('confession-count').textContent = data.count;
            }
        });
    const form = document.getElementById('confess-form');
    const confessionInput = document.getElementById('confession');
    const confessionReceivedContainer = document.getElementById('confession-received-container');
    const confessionReceived = document.getElementById('confession-received');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const confession = confessionInput.value.trim();
        if (!confession) return;
        // Hide confession received container before new submit
        confessionReceivedContainer.classList.add('hidden');
        confessionReceived.textContent = '';

        try {
            const resp = await fetch('/confess', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ confession })
            });
            const data = await resp.json();
            if (resp.ok) {
                confessionReceived.textContent = data.received_confession;
                confessionReceivedContainer.classList.remove('hidden');
                setTimeout(() => {
                    confessionReceivedContainer.classList.add('hidden');
                    confessionReceived.textContent = '';
                }, 8000);
            } else {
                confessionReceived.textContent = data.error || 'Something went wrong.';
                confessionReceivedContainer.classList.remove('hidden');
                setTimeout(() => {
                    confessionReceivedContainer.classList.add('hidden');
                    confessionReceived.textContent = '';
                }, 8000);
            }
            confessionInput.value = '';
            // Update confession count
            fetch('/confession_count')
                .then(resp => resp.json())
                .then(data => {
                    if (data.count !== undefined) {
                        document.getElementById('confession-count').textContent = data.count;
                    }
                });
        } catch (err) {
            confessionReceived.textContent = 'Network error. Please try again.';
            confessionReceivedContainer.classList.remove('hidden');
            setTimeout(() => {
                confessionReceivedContainer.classList.add('hidden');
                confessionReceived.textContent = '';
            }, 8000);
        }
    });

    // Allow Enter to submit, Shift+Enter for newline
    confessionInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.requestSubmit();
        }
    });
});
