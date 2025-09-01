function baseTemplate(title: string, content: string) {
  return `<!DOCTYPE html>
  <html lang="de">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      @font-face{
          font-family:Poppins;
          src:local("Poppins Regular Italic"),local("Poppins Italic"),url(https://solohost.de/_fonts/4nqMnahw4EylTG-rxpVh4fLO9QCQJoWr2lncpwyE7yQ-uQ4eKtifEfsIeW25CDLUwF__xv5Q0ZP91pjldddPrH0.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0900-097F,U+1CD0-1CF9,U+200C-200D,U+20A8,U+20B9,U+20F0,U+25CC,U+A830-A839,U+A8E0-A8FF,U+11B00-11B09;
          font-weight:400;
          font-style:italic
      }
      @font-face{
          font-family:"Poppins Fallback: Arial";
          src:local("Arial");
          size-adjust:112.1577%;
          ascent-override:93.6182%;
          descent-override:31.2061%;
          line-gap-override:8.916%
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Regular Italic"),local("Poppins Italic"),url(https://solohost.de/_fonts/bjNDQff8sSvRh4GSJLCMMDpBdKcXueWLQqqQmnFqm7o-PnCxAE8AuzD__0gGj4Qvm3a9lKlvOF2TB6qavuNC39Q.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;
          font-weight:400;
          font-style:italic
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Regular Italic"),local("Poppins Italic"),url(https://solohost.de/_fonts/m6rGg_mpoPQz2cTkdhDYgczR4yctyKztEG6iwU71C34-AzSzRzZx3PZOZ4Ry6KZFW0K4Yv_lRebQwATZnFSwRL4.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
          font-weight:400;
          font-style:italic
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Medium Italic"),url(https://solohost.de/_fonts/rbFrqeRM36phhWmxL6VJubAaF7xFDD-CL74c5vOc3E-CTvXm1_gQrD6sWPxT2qKoZlOlCiw7993kO-eOEzVUUE.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0900-097F,U+1CD0-1CF9,U+200C-200D,U+20A8,U+20B9,U+20F0,U+25CC,U+A830-A839,U+A8E0-A8FF,U+11B00-11B09;
          font-weight:500;
          font-style:italic
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Medium Italic"),url(https://solohost.de/_fonts/cfe5huB_y467A-yGRsjncGttRMYh8iB3HIAbd1-EgFk-mp54N6AgyjkilX_Sxytic_UfWDno4TOTdq_U7qSKlNk.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;
          font-weight:500;
          font-style:italic
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Medium Italic"),url(https://solohost.de/_fonts/5tRZydxhCpIwZ4Yf99ciVcTJxjB_TdL5XPynMmeCJR4-GwRg4pFlV38vok8FtwAwvz6BnDPvCJT6eAWWAJ1nCwM.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
          font-weight:500;
          font-style:italic
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins SemiBold Italic"),url(https://solohost.de/_fonts/lX7aDKKYeLZA-7UFDBWQ9W3HUzriCFb09I7aBBy59-k-DhgIZki7IfmH766f_dNy50xKS5pOgSDXBS9YADTrKxA.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0900-097F,U+1CD0-1CF9,U+200C-200D,U+20A8,U+20B9,U+20F0,U+25CC,U+A830-A839,U+A8E0-A8FF,U+11B00-11B09;
          font-weight:600;
          font-style:italic
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins SemiBold Italic"),url(https://solohost.de/_fonts/EOefiLcwRKJ4nKM16K6z_F-mq3lOHkCw6EhYBbQIHPQ-7lkBc0044lgpGlQpmCfU_IBN5bz4ryB3LrRgo2DajaM.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;
          font-weight:600;
          font-style:italic
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins SemiBold Italic"),url(https://solohost.de/_fonts/XUVCr3JJnCKa3ZjFe_4w-iDoaxDWfJzV4YCx_1QCo_E-Dd4FGprr0_vBL2tDAkGbBLQBgPkyVHwgqzLdW6BksCg.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
          font-weight:600;
          font-style:italic
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Bold Italic"),url(https://solohost.de/_fonts/ofE7KTMaY1tDe-E1l6xyNR3Baeec3wrHqn4SLGE5jng-_B3mf3e8BQg8S_n_5Mns4zQQvFHYGHcvyw29o-KZkhg.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0900-097F,U+1CD0-1CF9,U+200C-200D,U+20A8,U+20B9,U+20F0,U+25CC,U+A830-A839,U+A8E0-A8FF,U+11B00-11B09;
          font-weight:700;
          font-style:italic
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Bold Italic"),url(https://solohost.de/_fonts/tch9LzN5j_dlnjUtoti6RdPCzFPIC61h2dp093uB1d4-QZ6BSLaI0dQxSkicA0_r_5NQ_DHaMJsqJ8ke2XOzd2Y.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;
          font-weight:700;
          font-style:italic
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Bold Italic"),url(https://solohost.de/_fonts/0ncyUitqxXEtrEm7HzcQs5wcgo3wfV568UNDKlMnwsw-JVfoFugVKQswtgEirBJf3d6PtLLokJcD7O_iY3fx2gA.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
          font-weight:700;
          font-style:italic
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Regular"),local("Poppins"),url(https://solohost.de/_fonts/YYd83MoSlARiSnaHCOf3xZhlHMTpAMBVPTfJ-0r0AJo-s6WoYiqCMWZq6pz0ixlsOB1n2y992yPTBR4mo4VBY_s.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0900-097F,U+1CD0-1CF9,U+200C-200D,U+20A8,U+20B9,U+20F0,U+25CC,U+A830-A839,U+A8E0-A8FF,U+11B00-11B09;
          font-weight:400;
          font-style:normal
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Regular"),local("Poppins"),url(https://solohost.de/_fonts/vYKPADYc-DuiKOUdPseFWq8k7wot3DXAgkBGOtlALzM-jVUIANUHGkDZk24gkYZK_7z_vtdlKeNk67ivCrF_S1M.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;
          font-weight:400;
          font-style:normal
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Regular"),local("Poppins"),url(https://solohost.de/_fonts/YpdduKWWs-eOA_Cc_7jA92GH6kPvk9DopllJiZ2Ltr4-Yp6idP5W5_dwSvh8saVXH6F-juQRWqsTGrKUDGusGXI.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
          font-weight:400;
          font-style:normal
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Medium"),url(https://solohost.de/_fonts/Tc0TFyGArbpAWaq0vT5kxh4Gv-QAgYZbfJBID7AiZoc-9S3EJ_BKBNgVWD8dTh1bvF8ct1TyHyIHpChDP1ZRHnk.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0900-097F,U+1CD0-1CF9,U+200C-200D,U+20A8,U+20B9,U+20F0,U+25CC,U+A830-A839,U+A8E0-A8FF,U+11B00-11B09;
          font-weight:500;
          font-style:normal
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Medium"),url(https://solohost.de/_fonts/zDv8W5qScDHC1KDT1cvI7PwzOHF-p3XubgMMgTX-1UE-TqS140v_vE0VUK9Lv_MhP98jXXJcpaZseH2gZbOx7PY.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;
          font-weight:500;
          font-style:normal
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Medium"),url(https://solohost.de/_fonts/_WITXZSlvQMoD2fEgG1wXh8OdDfanMwrMC1wOPGgNhY-lD2Ln4sWK7AN0jIy9__CvYLOJfSKdKs23IPo5Lodw9Y.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
          font-weight:500;
          font-style:normal
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins SemiBold"),url(https://solohost.de/_fonts/UryfVQhdUFfQAWZ2bbTI-RoinBsdRuSEVqHxIRxRM5g-hqXSQVWBlUqQMDPJV281jA1mFLnMdBJtk6fA0oxGmxA.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0900-097F,U+1CD0-1CF9,U+200C-200D,U+20A8,U+20B9,U+20F0,U+25CC,U+A830-A839,U+A8E0-A8FF,U+11B00-11B09;
          font-weight:600;
          font-style:normal
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins SemiBold"),url(https://solohost.de/_fonts/op99aXquCGImGVv0pEDnzC7HS8p1SZ6VzEO576zT4MA-faoM5zSmZeEzw_0N7_OQbIKVD6CAd5gJr5Ffvj2eDFw.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;
          font-weight:600;
          font-style:normal
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins SemiBold"),url(https://solohost.de/_fonts/GZ8Vu2ga9Ys2RWqI_5_fmscGtaVz0BT0fO9HHusvG5Q-_OCOu4Ay1EDfCyjLosw_w0V6gLEi2YN4I6TM4T4ePZg.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
          font-weight:600;
          font-style:normal
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Bold"),url(https://solohost.de/_fonts/NBSqHp9sTXptKHK_6DBpp3VZdcgALu5hGE25rr2MePw-mrEGLllxXKqK71ESnVyNUJoIJJJLblGg332dg0fitUI.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0900-097F,U+1CD0-1CF9,U+200C-200D,U+20A8,U+20B9,U+20F0,U+25CC,U+A830-A839,U+A8E0-A8FF,U+11B00-11B09;
          font-weight:700;
          font-style:normal
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Bold"),url(https://solohost.de/_fonts/nco6D2lcYG_YRxaF8tG6Gs39nDWiQTHuWOjZbslCV8s-4U2AffmrIRiej5rU_F115H_9NLmSQBuC48SGx1wgpqE.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;
          font-weight:700;
          font-style:normal
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Bold"),url(https://solohost.de/_fonts/e-_sz56pssm7ydCJFOGAUPMl6TV_DbBVqRvEYBSrqVc-kj6mpPXfjmHwcrytBNSV16moBEv245C3D4hU3_JX4iQ.woff2) format(woff2);
          font-display:swap;
          unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
          font-weight:700;
          font-style:normal
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Regular Italic"),local("Poppins Italic"),url(https://solohost.de/_fonts/2tQKANG9OSxXFd9W6dFwpaPp1RR7VJl9aDDnCOQS_3w-hI_8UbVyd3xNO50Ztf0bYoHJmfft2Ap_8XrwDerZg_w.woff) format(woff);
          font-display:swap;
          font-weight:400;
          font-style:italic
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Medium Italic"),url(https://solohost.de/_fonts/l9KeOBPczt25ibTkyysroDQSSCSGy9zKW1aMFlwCmzo-68_CUi03g_9_1EGN0scmejbl3lBFu3w8EfTZbvUWfgY.woff) format(woff);
          font-display:swap;
          font-weight:500;
          font-style:italic
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins SemiBold Italic"),url(https://solohost.de/_fonts/Sj1g9pqMSgkcbw-LLzcvVZNIJ4n2xZIiU126DZPgK28-2t0iDjCwhWX4Tov5vl7k3cBrGVffYo9BkqpZe30GdXU.woff) format(woff);
          font-display:swap;
          font-weight:600;
          font-style:italic
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Bold Italic"),url(https://solohost.de/_fonts/hM2lt61QvFl_icArgTGe4i8_eXuynCFccrPwz-uioUA-nrAr6tUn_2dcX8W_zxtsJnfy6lrq2w3vL4Ytjgv3FAk.woff) format(woff);
          font-display:swap;
          font-weight:700;
          font-style:italic
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Regular"),local("Poppins"),url(https://solohost.de/_fonts/ZSg8KrVpBpHsi8CAn-AwHI_nhgQKA42WEqQ0uLqSn0U-Ocw_k_TUvNcSEeoLtmff2Cy8fRbwPWPrvNFtVXZcwA0.woff) format(woff);
          font-display:swap;
          font-weight:400;
          font-style:normal
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Medium"),url(https://solohost.de/_fonts/N6ampTaUafsu9Xb4-vyaXUKS-RHVyrAtICrN7jPcpHg-zunHPbnl_c1O292zbbcI2h_bAr6V3f4SnSfBWEVOv9Y.woff) format(woff);
          font-display:swap;
          font-weight:500;
          font-style:normal
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins SemiBold"),url(https://solohost.de/_fonts/_7Dlj7SfsaBoAJHHaugn-zttRHpxkzrTsD_Pf2UQnUg-3BRNGlkBTY1AZa8KHLhD2dYoskVWr7wS0uqgJSruZfQ.woff) format(woff);
          font-display:swap;
          font-weight:600;
          font-style:normal
      }
      @font-face{
          font-family:Poppins;
          src:local("Poppins Bold"),url(https://solohost.de/_fonts/N-EiVHFjINWPawNwZ409oTnwr8MHg2UXDrKMRA9hI7c-AlE425zan5zHDTzbe05VvqVtjdvLgcBw5uO4yiMwUD0.woff) format(woff);
          font-display:swap;
          font-weight:700;
          font-style:normal
      }
      
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: 'Inter', Arial, sans-serif;
      }
      table {
        border-spacing: 0;
        width: 100%;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
      }
      .header {
        padding: 20px;
        text-align: center;
      }
      .header img {
        max-width: 150px;
      }
      .content {
        padding: 30px;
        color: #333333;
        font-size: 16px;
        line-height: 1.5;
      }
      .btn {
        display: inline-block;
        padding: 14px 24px;
        background-color: #00a6f4;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #999999;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <img src="https://solohost.de/logo-bg-white.png" alt="Logo">
            </div>
            <!-- Content -->
            <div class="content">
              ${content}
            </div>
            <!-- Footer -->
            <div class="footer">
              <a href="https://solohost.de/impressum">Impressum</a> | <a href="https://solohost.de/datenschutz">Datenschutz</a>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </body>
  </html>`
}

function verificationEmail(userId: number, token: string, subscription: 'S' | 'L') {
  const { appHost } = useRuntimeConfig().public

  const verifyUrl = `https://${appHost}/api/verify/${userId}/${token}/${subscription}`

  return {
    html: baseTemplate('Solohost Bestätigungs-E-Mail', `<h2>Willkommen bei Solohost!</h2>
  <p>Bitte bestätigen Sie Ihr Abonnement, indem Sie den folgenden Button klicken:</p>
  <p style="text-align: center;">
    <a href="${verifyUrl}" class="btn">Abonnement abschließen</a>
  </p>
  <p>Vielen Dank für Ihr Vertrauen!<br>Ihr Solohost-Team</p>
</div>`),
    text: `Willkommen bei Solohost!\n\nBitte bestätigen Sie Ihr Abonnement, indem Sie den folgenden Link klicken:\n\n${verifyUrl}\n\nVielen Dank für Ihr Vertrauen!\nIhr Solohost-Team`,
  }
}

export const mailTemplates = {
  verificationEmail,
}
