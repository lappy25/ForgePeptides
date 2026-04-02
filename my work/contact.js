// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Create WhatsApp message with form data
            let message = `New Contact Form Submission:%0A%0A`;
            message += `Name: ${data.name}%0A`;
            message += `Email: ${data.email}%0A`;
            message += `Subject: ${data.subject}%0A%0A`;
            message += `Message: ${data.message}`;

            // Send to WhatsApp
            window.open(`https://wa.me/+19085701335?text=${message}`);

            // Reset form
            this.reset();

            // Show success message
            alert('Message sent successfully! We will get back to you soon.');
        });
    }
});