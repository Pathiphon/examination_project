import React, { useContext, useState, useEffect } from "react"
import { Routes ,Route ,Link,useNavigate,useParams,useLocation  } from 'react-router-dom';
import { UserContext } from "../context/UserContext"
import Button from '@mui/material/Button';
import Manage_exam from './Manage_exam'
import Edit_exam from "./Edit_exam";
import Create_exam from './Create_exam'

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FaceIcon from '@mui/icons-material/Face';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import DescriptionIcon from '@mui/icons-material/Description';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const drawerWidth = 220;


const Header = () => {
  const [token, setToken] = useContext(UserContext)
  const [user, setUser] = useState(null)


  const handleLogout = () => {
    setToken(null)
  }
  const {pathname} = useLocation();


  const fetchUser = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    const response = await fetch("/api/users/me", requestOptions);

    if (!response.ok) {
      console.log(response);
    }
    const data = await response.json()
    setUser(data)
  };
  useEffect(() => {
    fetchUser();
  }, [])

  return (
    <>
      <div>

        {token && (
          <Box sx={{ display: 'flex' }} >
            {pathname !== "/Create_exam"?(
              <>
            <CssBaseline />
            <AppBar
              position="fixed" 
              sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }} style={{ background: 'white'}}
            >
              <Toolbar >
                <Typography variant="h6" noWrap component="div" style={{ color: 'black' }}>
                  Test
                  
                </Typography>
              </Toolbar>
            </AppBar>
            <Drawer
              sx={{
                width: 100,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  boxSizing: 'border-box',
                  backgroundColor: "#212121",
                  color: 'white',
                }

              }}
              variant="permanent"
              anchor="left"

            >
              <h4 className="mx-auto pt-3">ระบบตรวจข้อสอบ</h4>
              <Toolbar />
              <FaceIcon className="icon_nav mx-auto svg_icons " />
              {user ?
                <h6 className="mx-auto pt-3">{user.firstname}&nbsp;&nbsp;{user.lastname}</h6>
                :
                "null"}
              <Divider />
              <List>
              <Link className="textDec" to="/Create_exam">
                  <ListItem button  >
                    <ListItemIcon>
                      <CreateNewFolderIcon className="icon_nav" />
                    </ListItemIcon>
                    <ListItemText primary="สร้างข้อสอบ" />
                  </ListItem>
                  </Link>
                <Link className="textDec" to="/Change_persen">
                  <ListItem button >
                    <ListItemIcon>
                      <DataUsageIcon className="icon_nav" />
                    </ListItemIcon>
                    <ListItemText primary="กำหนดเปอร์เซ็นต์" />
                  </ListItem>
                </Link>
              </List>
              <Divider />
              <List>
                <Link className="textDec" to="/">
                  <ListItem button >
                    <ListItemIcon>
                      <DescriptionIcon className="icon_nav" />
                    </ListItemIcon>
                    <ListItemText primary="จัดการข้อสอบ" />
                  </ListItem>
                </Link>
                <Link className="textDec" to="/Check_exam">
                  <ListItem button >
                    <ListItemIcon>
                      <FindInPageIcon className="icon_nav" />
                    </ListItemIcon>
                    <ListItemText primary="ตรวจข้อสอบ" />
                  </ListItem>
                </Link>
                <Link className="textDec" to="/Report">
                  <ListItem button >
                    <ListItemIcon>
                      <AnalyticsIcon className="icon_nav" />
                    </ListItemIcon>
                    <ListItemText primary="รายงานผลสอบ" />
                  </ListItem>
                </Link>
              </List>
              <Divider />
              <List>
                <Link className="textDec" to="/Profile">
                  <ListItem button >
                    <ListItemIcon>
                      <AccountCircleIcon className="icon_nav" />
                    </ListItemIcon>
                    <ListItemText primary="จัดการโปรไฟล์" />
                  </ListItem>
                </Link>
                <Link className="textDec" to="/Logout">
                  <ListItem button onClick={handleLogout} >
                    <ListItemIcon>
                      <ExitToAppIcon className="icon_nav" />
                    </ListItemIcon>
                    <ListItemText primary="ออกจากระบบ" />
                  </ListItem>
                </Link>

              </List>

            </Drawer>

            <Box
              component="main"
              sx={{ flexGrow: 1, bgcolor: 'background.default', p: 2 }}
            >
              <Toolbar />
              <Routes>
                {/* <Route path='/Create_exam' element={<Create_exam/>}/> */}
                <Route path='/' element={<Manage_exam/>}/>
              </Routes>
              
            </Box>
           </> ):(
             <div className="w-100" >
             <Create_exam />
             </div>
           )}
           
          </Box>
          
           
        )}
        
      </div>
      
    </>
  );
};
export default Header;