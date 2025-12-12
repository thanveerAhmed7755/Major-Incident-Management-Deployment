        // --- DATA MANAGEMENT ---
        let currentView = 'live'; // 'live' or 'sample'
        let currentStatus = 'red';

        // Hardcoded Sample Data (Reference Only)
        const CCs = `s.thanveer7755@gmail.com`

        const sampleData = {
            priority: "P1 Major",
            incRef: "INC1234567",
            shortDesc: "Unable to process payments at Checkout",
            miStatus: "Engagement",
            techArea: "Payment Gateway",
            impactedLoc: "All National Stores & Online",
            wiproScope: "Yes",
            incStage: "Investigation",
            bizImpact: "Customers are unable to finalize transactions via Credit Card. PayPal is unaffected. High potential revenue loss estimated at $50k/hr.",
            startTime: "25-Oct 09:00",
            miTime: "25-Oct 09:15",
            restoreTime: "-- : --",
            repeatInc: "No",
            riskRef: "N/A",
            chgRef: "CHG987654",
            vendorTkt: "VND-554421",
            participants: "John Doe, Jane Smith, Network Team",
            findings: "Network operations team engaged to trace packet loss.\nVendor (PaymentProv) confirmed global outage on their end.\nFailover to secondary link initiated but failed.\nReboot of Edge Router scheduled for 10:45 AEDT.",
            nextUpdate: "10:30 AEDT",
            wiproIM: "Alice W.",
            wiproOM: "Bob M.",
            bridge: "http://teams-link.com",
            chat: "http://chat-link.com",
            runSheet: "http://runsheet-link.com",
            bridgeStatus: "yes"
        };

        // --- THEME CONFIGURATION ---
        const themes = {
            red: { 
                headerGradient: 'linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)', 
                headerBorder: '#991b1b',
                badgeBg: '#fef2f2',
                badgeText: '#dc2626',
                accent: '#dc2626',
                lightBg: '#fef2f2',
                title: 'INVESTIGATION IN PROGRESS',
                icon: '🚨',
                selectorBg: '#7f1d1d',
                selectorText: '#fca5a5',
                selectorBorder: '#ef4444'
            },
            orange: { 
                headerGradient: 'linear-gradient(135deg, #c2410c 0%, #f97316 100%)', 
                headerBorder: '#9a3412',
                badgeBg: '#fff7ed',
                badgeText: '#ea580c',
                accent: '#ea580c',
                lightBg: '#fff7ed',
                title: 'RESTORATION IN PROGRESS',
                icon: '⚠️',
                selectorBg: '#7c2d12',
                selectorText: '#fdba74',
                selectorBorder: '#f97316'
            },
            green: { 
                headerGradient: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)', 
                headerBorder: '#166534',
                badgeBg: '#f0fdf4',
                badgeText: '#16a34a',
                accent: '#16a34a',
                lightBg: '#f0fdf4',
                title: 'INCIDENT RESOLVED',
                icon: '✅',
                selectorBg: '#14532d',
                selectorText: '#86efac',
                selectorBorder: '#22c55e'
            }
        };

        // --- CORE FUNCTIONS ---

        function switchTab(tab) {
            currentView = tab;
            const liveTabBtn = document.getElementById('tab-live');
            const sampleTabBtn = document.getElementById('tab-sample');
            const configPanel = document.getElementById('config-panel');
            const previewPanel = document.getElementById('preview-panel');

            if (tab === 'live') {
                // Live Mode: Show Form
                liveTabBtn.classList.add('active');
                liveTabBtn.classList.remove('inactive');
                
                sampleTabBtn.classList.remove('active');
                sampleTabBtn.classList.add('inactive');

                configPanel.classList.remove('hidden');
                previewPanel.classList.remove('w-full');
                previewPanel.classList.add('lg:w-1/2');
                
            } else {
                // Sample Mode: Hide Form, Full Width Preview
                sampleTabBtn.classList.add('active');
                sampleTabBtn.classList.remove('inactive');
                
                liveTabBtn.classList.remove('active');
                liveTabBtn.classList.add('inactive');

                configPanel.classList.add('hidden');
                previewPanel.classList.remove('lg:w-1/2');
                previewPanel.classList.add('w-full');
            }
            updatePreview();
        }

        function handleStatusChange() {
            const selector = document.getElementById('statusSelector');
            if (!selector) return;
            currentStatus = selector.value;
            const t = themes[currentStatus];
            selector.style.backgroundColor = t.selectorBg;
            selector.style.color = t.selectorText;
            selector.style.borderColor = t.selectorBorder;
            updatePreview();
        }

        function handleBridgeStatus() {
            const status = document.getElementById('bridgeStatus').value;
            const container = document.getElementById('bridgeLinkContainer');
            
            if(status === 'no') {
                container.style.display = 'none';
            } else {
                container.style.display = 'block';
            }
            updatePreview();
        }

        // Helper to get data based on current view (Live vs Sample)
        function getData(key) {
            if (currentView === 'sample') {
                return sampleData[key];
            } else {
                const el = document.getElementById(key);
                const val = el ? el.value : '';
                // Return a placeholder if empty to maintain table structure in preview
                return val ? val : '<span style="color:#e5e7eb; font-style:italic;">--</span>';
            }
        }
        
        // Function to get raw link URL (without placeholder spans) for href
        function getLink(key) {
            if (currentView === 'sample') {
                return sampleData[key];
            } else {
                const el = document.getElementById(key);
                const val = el ? el.value : '';
                return val ? val : '#';
            }
        }

        function getBridgeStatus() {
             if (currentView === 'sample') return 'yes';
             const el = document.getElementById('bridgeStatus');
             return el ? el.value : 'yes'; 
        }

        function formatPoints(text, color) {
            if (!text || text.includes('--')) return '';
            const lines = text.split('\n').filter(line => line.trim() !== '');
            const listItems = lines.map(line => `
                <tr style="vertical-align: top;">
                    <td style="width: 20px; padding-bottom: 4px; padding-top: 0px;">
                        <span style="color: ${color}; font-size: 18px; line-height: 1;">•</span>
                    </td>
                    <td style="padding-bottom: 4px; color: #000000; font-size: 13px; font-weight: 400; font-family: 'Segoe UI', Roboto, sans-serif; line-height: 1.5;">
                        ${line}
                    </td>
                </tr>`).join('');
            return `<table border="0" cellpadding="0" cellspacing="0" width="100%">${listItems}</table>`;
        }

        // UNIFORM STYLE CONSTANTS
        function getLabelStyle() {
            // UNIFORM COLOR FOR ALL HEADINGS: #000000 (Black) & EXTRA BOLD
            return "display: block; font-size: 11px; color: #000000; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; font-family: 'Segoe UI', Roboto, sans-serif;";
        }

        function getValueStyle() {
            // UNIFORM COLOR FOR ALL VALUES: #000000 (Black) & NORMAL WEIGHT
            return "color: #000000; font-weight: 400; font-size: 13px; font-family: 'Segoe UI', Roboto, sans-serif; line-height: 1.4;";
        }

        function updatePreview() {
            const theme = themes[currentStatus];
            const findingsHtml = formatPoints(getData('findings'), theme.accent);
            let participantsHtml = getData('participants');
            if (participantsHtml && !participantsHtml.includes('--')) {
                participantsHtml = participantsHtml.replace(/\n/g, '<br>');
            }
            
            const labelStyle = getLabelStyle();
            const valueStyle = getValueStyle();

            // Bridge Button Logic
            const bridgeStatus = getBridgeStatus();
            let bridgeHtml = '';
            
            if(bridgeStatus === 'yes') {
                bridgeHtml = `<a href="${getLink('bridge')}" style="display: block; text-decoration: none; background-color: #2563eb; color: #ffffff; padding: 12px 0; border-radius: 8px; font-size: 12px; font-weight: 700; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2); font-family: 'Segoe UI', Roboto, sans-serif;">📞 Join bridge</a>`;
            } else {
                // Updated to match Join Bridge style (Solid Gray Button)
                bridgeHtml = `<div style="display: block; background-color: #6b7280; color: #ffffff; padding: 12px 0; border-radius: 8px; font-size: 12px; font-weight: 700; box-shadow: 0 4px 6px rgba(100, 116, 139, 0.2); font-family: 'Segoe UI', Roboto, sans-serif; cursor: default;">🚫 Bridge closed</div>`;
            }

   const html = `
<!-- Outer DIV with WHITE background to prevent dark theme leak when copying -->
<div style="background-color: #ffffff; padding: 10px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="700" cellpadding="0" cellspacing="0" border="0" align="left" style="width: 700px; margin: 0; background-color: #ffffff; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #000000; font-size: 13px; border: 1px solid #e5e7eb; border-collapse: separate; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        
        <!-- HEADER -->
        <tr>
            <td style="background: ${theme.headerGradient}; padding: 0;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td style="padding: 30px;">
                            <!-- Priority Badge -->
                            <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="background-color: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); padding: 4px 10px; border-radius: 4px;">
                                        <span style="color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">${getData('priority')}</span>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Incident ID -->
                            <h1 style="color: #ffffff; font-size: 32px; margin: 10px 0 5px 0; font-weight: 800; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${getData('incRef')}</h1>
                            
                            <!-- Short Description -->
                            <p style="color: rgba(255,255,255,0.95); font-size: 16px; margin: 0; font-weight: 500; line-height: 1.4;">${getData('shortDesc')}</p>
                        </td>
                        <!-- Status Icon/Box -->
                        <td width="200" align="right" valign="top" style="padding: 30px;">
                            <!-- White background box for status -->
                            <table cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                <tr>
                                    <td align="center" style="padding: 12px 16px;">
                                        <div style="font-size: 24px; margin-bottom: 2px;">${theme.icon}</div>
                                        <div style="color: ${theme.accent}; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Roboto, sans-serif;">${theme.title}</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- CONTENT BODY -->
        <tr>
            <td style="padding: 35px; background-color: #ffffff;">

                <!-- EXECUTIVE SUMMARY CARD -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px; background-color: ${theme.lightBg}; border-left: 5px solid ${theme.accent}; border-radius: 4px;">
                    <tr>
                        <td style="padding: 20px;">
                            <span style="display: block; color: ${theme.accent}; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; font-family: 'Segoe UI', Roboto, sans-serif;">Business impact</span>
                            <div style="color: #000000; font-size: 13px; line-height: 1.6; font-weight: 400; font-family: 'Segoe UI', Roboto, sans-serif;">
                                ${getData('bizImpact')}
                            </div>
                        </td>
                    </tr>
                </table>

                <!-- CORE DETAILS GRID -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                    <tr>
                        <td>
                            <!-- UPDATED COLOR: Royal Blue #1d4ed8 -->
                            <h3 style="color: #1d4ed8; font-size: 16px; font-weight: 800; text-transform: uppercase; border-bottom: 2px solid #1d4ed8; padding-bottom: 8px; margin: 0 0 15px 0; font-family: 'Segoe UI', Roboto, sans-serif;">📋 Incident Details</h3>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table width="100%" cellpadding="12" cellspacing="0" border="0" style="border: 1px solid #e5e7eb; border-radius: 8px; border-collapse: separate;">
                                <tr>
                                    <td width="50%" style="background-color: #f8fafc; border-bottom: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
                                        <span style="${labelStyle}">Incident Stage</span>
                                        <span style="${valueStyle}">${getData('incStage')}</span>
                                    </td>
                                    <td width="50%" style="background-color: #f8fafc; border-bottom: 1px solid #e5e7eb;">
                                        <span style="${labelStyle}">Technology area affected</span>
                                        <span style="${valueStyle}">${getData('techArea')}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color: #ffffff; border-right: 1px solid #e5e7eb;">
                                        <span style="${labelStyle}">Impacted Location</span>
                                        <span style="${valueStyle}">${getData('impactedLoc')}</span>
                                    </td>
                                    <td style="background-color: #ffffff;">
                                        <span style="${labelStyle}">Wipro Scope</span>
                                        <span style="${valueStyle}">${getData('wiproScope')}</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- TIMELINE -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                    <tr>
                        <td>
                            <!-- UPDATED COLOR: Amber/Orange #b45309 -->
                            <h3 style="color: #b45309; font-size: 16px; font-weight: 800; text-transform: uppercase; border-bottom: 2px solid #b45309; padding-bottom: 8px; margin: 0 0 15px 0; font-family: 'Segoe UI', Roboto, sans-serif;">⏱️ Incident Timelines</h3>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td width="32%" style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 12px; border-radius: 6px; text-align: center;">
                                        <span style="${labelStyle}">INC Opened time</span>
                                        <strong style="${valueStyle} color: #1e40af;">${getData('startTime')}</strong>
                                    </td>
                                    <td width="2%"></td>
                                    <td width="32%" style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 12px; border-radius: 6px; text-align: center;">
                                        <span style="${labelStyle}">MI Declared time</span>
                                        <strong style="${valueStyle} color: ${theme.accent}; font-weight: 700;">${getData('miTime')}</strong>
                                    </td>
                                    <td width="2%"></td>
                                    <td width="32%" style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 12px; border-radius: 6px; text-align: center;">
                                        <span style="${labelStyle}">Resolved/ Restored time</span>
                                        <strong style="${valueStyle} color: #166534; font-weight: 700;">${getData('restoreTime')}</strong>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- RELATED RECORDS / CLASSIFICATION -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                    <tr>
                        <td>
                            <!-- UPDATED COLOR: Deep Purple #7e22ce -->
                            <h3 style="color: #7e22ce; font-size: 16px; font-weight: 800; text-transform: uppercase; border-bottom: 2px solid #7e22ce; padding-bottom: 8px; margin: 0 0 15px 0; font-family: 'Segoe UI', Roboto, sans-serif;">🔗 Related Records</h3>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td width="23.5%" style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 12px 5px; border-radius: 6px; text-align: center;">
                                        <span style="${labelStyle}">Repeated Incident?</span>
                                        <strong style="${valueStyle}">${getData('repeatInc')}</strong>
                                    </td>
                                    <td width="2%"></td>
                                    <td width="23.5%" style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 12px 5px; border-radius: 6px; text-align: center;">
                                        <span style="${labelStyle}">Known Issue</span>
                                        <strong style="${valueStyle}">${getData('riskRef')}</strong>
                                    </td>
                                    <td width="2%"></td>
                                    <td width="23.5%" style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 12px 5px; border-radius: 6px; text-align: center;">
                                        <span style="${labelStyle}">Caused By Change</span>
                                        <strong style="${valueStyle}">${getData('chgRef')}</strong>
                                    </td>
                                    <td width="2%"></td>
                                    <td width="23.5%" style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 12px 5px; border-radius: 6px; text-align: center;">
                                        <span style="${labelStyle}">Vendor Ticket</span>
                                        <strong style="${valueStyle}">${getData('vendorTkt')}</strong>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- PARTICIPANTS -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                    <tr>
                        <td>
                            <!-- UPDATED COLOR: Emerald Green #047857 -->
                            <h3 style="color: #047857; font-size: 16px; font-weight: 800; text-transform: uppercase; border-bottom: 2px solid #047857; padding-bottom: 8px; margin: 0 0 15px 0; font-family: 'Segoe UI', Roboto, sans-serif;">👥 Participants</h3>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px;">
                            <div style="${valueStyle}">${participantsHtml}</div>
                        </td>
                    </tr>
                </table>

                <!-- TECHNICAL ANALYSIS -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                    <tr>
                        <td>
                            <!-- UPDATED COLOR: Rose Red #be123c -->
                            <h3 style="color: #be123c; font-size: 16px; font-weight: 800; text-transform: uppercase; border-bottom: 2px solid #be123c; padding-bottom: 8px; margin: 0 0 15px 0; font-family: 'Segoe UI', Roboto, sans-serif;">🛠️ Infra Actions</h3>
                        </td>
                    </tr>
                    <tr>
                        <!-- UPDATED: Background color changed from #fffbeb (yellow) to #f9fafb (gray) to match other boxes -->
                        <td style="padding: 15px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                            <div style="font-size: 13px; line-height: 1.6; font-family: 'Segoe UI', Roboto, sans-serif; color: #000000;">
                                ${findingsHtml}
                            </div>
                        </td>
                    </tr>
                </table>

                <!-- ACTION BUTTONS -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                    <tr>
                        <td width="32%" align="center">
                            ${bridgeHtml}
                        </td>
                        <td width="2%"></td>
                        <td width="32%" align="center">
                            <a href="${getLink('chat')}" style="display: block; text-decoration: none; background-color: #7c3aed; color: #ffffff; padding: 12px 0; border-radius: 8px; font-size: 12px; font-weight: 700; box-shadow: 0 2px 4px rgba(124, 58, 237, 0.3); font-family: 'Segoe UI', Roboto, sans-serif;">💬 Incident chat link</a>
                        </td>
                        <td width="2%"></td>
                        <td width="32%" align="center">
                            <a href="${getLink('runSheet')}" style="display: block; text-decoration: none; background-color: #1f2937; color: #ffffff; padding: 12px 0; border-radius: 8px; font-size: 12px; font-weight: 700; box-shadow: 0 2px 4px rgba(31, 41, 55, 0.3); font-family: 'Segoe UI', Roboto, sans-serif;">📄 Run sheet link</a>
                        </td>
                    </tr>
                </table>

                <!-- MANAGEMENT FOOTER -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td width="32%" style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px; text-align: center;">
                            <span style="${labelStyle}">Next Update</span>
                            <strong style="${valueStyle}">${getData('nextUpdate')}</strong>
                        </td>
                        <td width="2%"></td>
                        <td width="32%" style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px; text-align: center;">
                            <span style="${labelStyle}">Wipro Incident Manager</span>
                            <strong style="${valueStyle}">${getData('wiproIM')}</strong>
                        </td>
                        <td width="2%"></td>
                        <td width="32%" style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px; text-align: center;">
                            <span style="${labelStyle}">Wipro Operations Manager</span>
                            <strong style="${valueStyle}">${getData('wiproOM')}</strong>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>

        <!-- FOOTER -->
        <tr>
            <td style="background: linear-gradient(to bottom, #0f172a, #1e293b); padding: 25px 40px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #334155;">
                
                <!-- Quote - Font increased to 14px -->
                <p style="margin: 0 0 20px 0; color: #94a3b8; font-size: 14px; font-family: 'Segoe UI', Roboto, sans-serif; font-style: italic; letter-spacing: 0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    "Every outage tests resilience—respond fast, restore with purpose, lead with confidence."
                </p>
                
                <!-- Styled Divider with Status Color Hint -->
                <div style="height: 1px; background: linear-gradient(to right, transparent, ${theme.accent}, transparent); opacity: 0.5; width: 100%; margin: 0 auto 25px auto;"></div>

                <!-- Contact Section -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td align="center">
                            <!-- UPDATED: Text changed and Uppercase removed -->
                            <span style="display: block; margin-bottom: 15px; color: #cbd5e1; font-size: 12px; font-weight: 400; font-family: 'Segoe UI', Roboto, sans-serif;">
                                For any further clarifications or assistance, please feel free to reach out - <strong style="color: #ffffff;">Wipro Incident Managers</strong>
                            </span>
                            
                            <div style="display: inline-block; background-color: rgba(255,255,255,0.03); padding: 12px 30px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.1);">
                                <span style="color: #ffffff; font-weight: 600; font-size: 13px; vertical-align: middle;">📞 +91 91760 90163</span>
                                <span style="color: #475569; margin: 0 15px; font-size: 14px; vertical-align: middle;">|</span>
                                <a href="mailto:infrasupportoperations@woolworths.com.au" style="color: #60a5fa; text-decoration: none; font-weight: 600; font-size: 13px; vertical-align: middle;">✉️ infrasupportoperations@woolworths.com.au</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <br>
    <p style="font-family: 'Segoe UI', Roboto, sans-serif; font-size: 1px; color: transparent;">&nbsp;</p>
    <p style="font-family: 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #000000;">&nbsp;</p>
</div>`;

        document.getElementById('email-preview-container').innerHTML = html;
    }

    function copyToClipboard() {
        const incRef = document.getElementById('incRef').value.trim();
        const shortDesc = document.getElementById('shortDesc').value.trim();
        const bizImpact = document.getElementById('bizImpact').value.trim();

        if (!incRef && !shortDesc && !bizImpact) {
                showToast("Please enter the values to copy the template", "error");
                return;
        }
        
        if (currentView === 'sample') {
            showToast("Sample preview cannot be copied. Please switch to 'Edit Draft'.", "error");
            return;
        }

        const node = document.getElementById('email-preview-container');
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);

        try {
            const successful = document.execCommand('copy');
            if(successful) {
                showToast('Template copied successfully', 'success');
            } else {
                throw new Error('Copy command failed');
            }
        } catch (err) {
            console.error('Failed to copy', err);
            alert('Manual Copy: Please select the email text on the right and copy it (Ctrl+C).');
        }
        selection.removeAllRanges();
    }

    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const msgElement = document.getElementById('toast-msg');
        const iconElement = document.getElementById('toast-icon');
        const titleElement = document.getElementById('toast-title');
        
        // Configure colors based on type
        if (type === 'error') {
            toast.classList.remove('bg-blue-600', 'border-blue-400');
            toast.classList.add('bg-red-600', 'border-red-400');
            if (iconElement) iconElement.className = 'fas fa-exclamation-triangle text-xs';
            if (titleElement) titleElement.innerText = 'Action Blocked';
            if (msgElement) msgElement.innerText = message;
        } else {
            toast.classList.remove('bg-red-600', 'border-red-400');
            toast.classList.add('bg-blue-600', 'border-blue-400');
            if (iconElement) iconElement.className = 'fas fa-check text-xs';
            if (titleElement) titleElement.innerText = 'Copied to Clipboard!';
            if (msgElement) msgElement.innerText = message;
        }
        
        toast.classList.remove('hidden');
        toast.classList.remove('opacity-0');
        toast.classList.remove('pointer-events-none');
        toast.classList.remove('translate-y-32');
        
        setTimeout(() => { 
            toast.classList.add('translate-y-32');
            toast.classList.add('opacity-0');
            setTimeout(() => {
                toast.classList.add('hidden');
                toast.classList.add('pointer-events-none');
            }, 300);
        }, 3000);
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        handleStatusChange();
        handleBridgeStatus();
        switchTab('live'); 
    });

    document.getElementById("sendEmailBtn").addEventListener("click", function() {
    const emailData = {
    to: 'tahmed7@wipro.woolworths.com.au',
    subject: 'Hello with HTML Content',
    text: 'This is the plain text content of the email.', // Plain text version
    html: '<h1>Hello World Buddy!</h1>'
    };
    

    fetch('http://localhost:3000/send-email', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
    })
    .then(response => response.json())
    .then(data => {
    console.log('Email sent:', data);
    alert('Email sent successfully!');
    })
    .catch(error => {
    console.error('Error sending email:', error);
    alert('Failed to send email.');
    });
    });
        


