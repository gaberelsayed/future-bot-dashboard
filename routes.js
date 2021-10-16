import React from 'react';
import DefaultLayout from './containers/DefaultLayout';

const HomePage = React.lazy(() => import('./views/HomePage'));
const Profile = React.lazy(() => import('./views/Profile'));
const Cp = React.lazy(() => import('./views/Cp'));
const Payment = React.lazy(() => import('./views/Payment'));
const MainDash = React.lazy(() => import('./views/MainDash'));
const BotID = React.lazy(() => import('./views/BotID'));

// > Properties - الخصائص 
const properties = React.lazy(() => import('./views/properties'));
const Welcome = React.lazy(() => import('./views/properties/Welcome'));
const VoiceOnline = React.lazy(() => import('./views/properties/VoiceOnline'));
const Autores = React.lazy(() => import('./views/properties/Autores'));
const Reaction = React.lazy(() => import('./views/properties/Reaction'));
const Tempchannels = React.lazy(() => import('./views/properties/Tempchannels'));

// > Commands - الأوامر
// Admin Commands - الأوامر الأدرية
const Commands = React.lazy(() => import('./views/Commands'));
const Admins = React.lazy(() => import('./views/Commands/Admins'));
const Role = React.lazy(() => import('./views/Commands/Admins/Role'));
const Ban = React.lazy(() => import('./views/Commands/Admins/Ban'));
const Kick = React.lazy(() => import('./views/Commands/Admins/Kick'));
const Bc = React.lazy(() => import('./views/Commands/Admins/Bc'));
const Activitymanager = React.lazy(() => import('./views/Commands/Admins/Activitymanager'));
const Warn = React.lazy(() => import('./views/Commands/Admins/Warn'));
const Clear = React.lazy(() => import('./views/Commands/Admins/Clear'));
const Embed = React.lazy(() => import('./views/Commands/Admins/Embed'));
const TMute = React.lazy(() => import('./views/Commands/Admins/TMute'));
const Vmute = React.lazy(() => import('./views/Commands/Admins/Vmute'));
const Vkick = React.lazy(() => import('./views/Commands/Admins/Vkick'));
const PMute = React.lazy(() => import('./views/Commands/Admins/PMute'));
const AddEmoji = React.lazy(() => import('./views/Commands/Admins/AddEmoji'));
const Setnick = React.lazy(() => import('./views/Commands/Admins/Setnick'));
const Move = React.lazy(() => import('./views/Commands/Admins/Move'));
// Public Commands - الأوامر العامة
const Public = React.lazy(() => import('./views/Commands/Public'));
const Link = React.lazy(() => import('./views/Commands/Public/Link'));
const Colors = React.lazy(() => import('./views/Commands/Public/Colors'));
const Play = React.lazy(() => import('./views/Commands/Public/Play'));
const ID = React.lazy(() => import('./views/Commands/Public/ID'));
// > Protection system - الحماية
const protsystem = React.lazy(() => import('./views/protsystem'));
const Ads = React.lazy(() => import('./views/protsystem/ProtAds'));
const Gahfala = React.lazy(() => import('./views/protsystem/ProtGahfala'));
const Links = React.lazy(() => import('./views/protsystem/ProtLinks'));
const Spam = React.lazy(() => import('./views/protsystem/ProtSpam'));

// > Server Settings - أعدادات السيرفر
const Members = React.lazy(() => import('./views/Members'));
const Charts = React.lazy(() => import('./views/Charts'));
const Logs = React.lazy(() => import('./views/Logs'));

const routes = [
  { path: '/', name: 'HomePage', component: HomePage, exact: true,main: true },
  { path: '/Profile', name: 'Profile', component: Profile,profile: true },
  { path: '/Cp', name: 'Cp', component: Cp,profile: true },
  { path: '/Payment', name: 'Payment', component: Payment,profile: true,main: true },
  { path: '/dashboard', name: 'Dashboard', component: DefaultLayout, exact: true },

  { path: '/dashboard/main', name: 'Main', component: MainDash },
  { path: '/dashboard/BotID', name: 'BotID', component: BotID },

  // > Properties - الخصائص 
  { path: '/dashboard/properties', name: 'properties', component: properties, exact: true },
  { path: '/dashboard/properties/Welcome', name: 'Welcome', component: Welcome },
  { path: '/dashboard/properties/VoiceOnline', name: 'VoiceOnline', component: VoiceOnline },
  { path: '/dashboard/properties/Autores', name: 'Auto Responds', component: Autores },
  { path: '/dashboard/properties/Reaction', name: 'Reaction Role', component: Reaction },
  { path: '/dashboard/properties/Tempchannels', name: 'Temp Channels', component: Tempchannels },

  // > Commands - الأوامر
  { path: '/dashboard/commands', name: 'Commands', component: Commands, exact: true },
  // Admin Commands - الأوامر الأدرية
  { path: '/dashboard/commands/admins', name: 'Admins', component: Admins, exact: true },
  { path: '/dashboard/commands/admins/role', name: 'Role', component: Role },
  { path: '/dashboard/commands/admins/ban', name: 'Ban', component: Ban },
  { path: '/dashboard/commands/admins/kick', name: 'Kick', component: Kick },
  { path: '/dashboard/commands/admins/bc', name: 'Bc', component: Bc },
  { path: '/dashboard/commands/admins/activitymanager', name: 'Activitymanager', component: Activitymanager },
  { path: '/dashboard/commands/admins/warn', name: 'Warn', component: Warn },
  { path: '/dashboard/commands/admins/embed', name: 'Embed', component: Embed },
  { path: '/dashboard/commands/admins/clear', name: 'Clear', component: Clear },
  { path: '/dashboard/commands/admins/tmute', name: 'Mute', component: TMute },
  { path: '/dashboard/commands/admins/vmute', name: 'Vmute', component: Vmute },
  { path: '/dashboard/commands/admins/AddEmoji', name: 'AddEmoji', component: AddEmoji },
  { path: '/dashboard/commands/admins/Setnick', name: 'Setnick', component: Setnick },
  { path: '/dashboard/commands/admins/vkick', name: 'Vkick', component: Vkick },
  { path: '/dashboard/commands/admins/PMute', name: 'PMute', component: PMute },
  { path: '/dashboard/commands/admins/Move', name: 'Move', component: Move },
  // Public Commands - الأوامر العامة
  { path: '/dashboard/commands/Public', name: 'Public', component: Public, exact: true },
  { path: '/dashboard/commands/Public/Link', name: 'Link', component: Link },
  { path: '/dashboard/commands/Public/Colors', name: 'Colors', component: Colors },
  { path: '/dashboard/commands/Public/Play', name: 'Play', component: Play },
  { path: '/dashboard/commands/Public/ID', name: 'ID', component: ID },

  // > Protection system - الحماية
  { path: '/dashboard/protsystem', name: 'Protection', component: protsystem, exact: true },
  { path: '/dashboard/protsystem/protlinks', name: 'Links', component: Links },
  { path: '/dashboard/protsystem/protspam', name: 'Spam', component: Spam },
  { path: '/dashboard/protsystem/protgahfala', name: 'Gahfala', component: Gahfala },
  { path: '/dashboard/protsystem/protads', name: 'Ads', component: Ads },

  // > Server Settings - أعدادات السيرفر
  { path: '/dashboard/members', exact: true,name: 'Members', component: Members },
  { path: '/dashboard/charts', name: 'Charts', component: Charts },
  { path: '/dashboard/logs', name: 'logs', component: Logs },
];

export default routes;
