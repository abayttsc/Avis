import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys
import json

def send_sms_via_gateway(smtp_config, recipient_email, message_body):
    """
    Sends an SMS by emailing the carrier's SMTP-to-SMS gateway.
    """
    try:
        msg = MIMEMultipart()
        msg['From'] = smtp_config['user']
        msg['To'] = recipient_email
        msg['Subject'] = "AVIS Inspection Alert"

        msg.attach(MIMEText(message_body, 'plain'))

        server = smtplib.SMTP(smtp_config['host'], smtp_config['port'])
        server.starttls()
        server.login(smtp_config['user'], smtp_config['pass'])
        text = msg.as_string()
        server.sendmail(smtp_config['user'], recipient_email, text)
        server.quit()
        return True, "SMS sent successfully"
    except Exception as e:
        return False, str(e)

if __name__ == "__main__":
    # Expecting JSON input via stdin for integration with Node/Electron
    try:
        input_data = json.load(sys.stdin)
        config = input_data['config']
        recipient = input_data['recipient']
        body = input_data['body']

        success, message = send_sms_via_gateway(config, recipient, body)
        print(json.dumps({"success": success, "message": message}))
    except Exception as e:
        print(json.dumps({"success": False, "message": f"Bridge Error: {str(e)}"}))
