from playwright.sync_api import sync_playwright
import time
import sys

def run_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print("Navigating to /dashboard/add...")
        
        # Navigate to the target page
        res = page.goto('http://localhost:3000/dashboard/add')
        
        if not res.ok:
            print(f"Failed to load page. Status: {res.status}")
            browser.close()
            sys.exit(1)
            
        page.wait_for_load_state('networkidle')
        print("Page loaded successfully.")
        
        # Save a screenshot of the initial state
        page.screenshot(path='.agent/scripts/add_form_initial.png', full_page=True)
        
        print("1. Testing Tabs and Progressive Disclosure...")
        
        amount_input = page.locator('input[placeholder="0"]')
        amount_input.wait_for(state="visible")
        
        print("Typing amount: 150.00")
        amount_input.fill("150.00")
        time.sleep(1) # wait for animation
        
        page.screenshot(path='.agent/scripts/add_form_amount_filled.png', full_page=True)
        
        source_account = page.locator('button:has-text("Cuenta Origen")').first
        if not source_account.is_visible():
            print("ERROR: Progressive disclosure failed. Source account field not visible after amount entry.")
        else:
            print("SUCCESS: Progressive disclosure worked for Amount input.")
            
        print("2. Testing Transaction Types...")
        ingreso_tab = page.locator('button:has-text("Ingreso")')
        ingreso_tab.click()
        time.sleep(1)
        
        dest_account = page.locator('button:has-text("Cuenta Destino")').first
        if dest_account.is_visible():
            print("SUCCESS: Switched to Ingreso and required fields rendered.")
        else:
            print("ERROR: Expected Destination Account for Ingreso, but it is missing.")
            
        transfer_tab = page.locator('button:has-text("Transf.")')
        transfer_tab.click()
        time.sleep(1)
        
        if page.locator('button:has-text("Origen...")').is_visible() and page.locator('button:has-text("Destino...")').is_visible():
            print("SUCCESS: Transfer fields rendered correctly.")
        else:
             print("ERROR: Transfer fields are incorrectly rendered.")
        
        browser.close()
        print("Tests completed.")

if __name__ == '__main__':
    run_test()
