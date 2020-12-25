import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Home } from '../pages/Home/Home'
import { LoginPage } from '../pages/Login/Login'
import { LoginSuccessPage } from '../pages/Login/LoginSuccess'
import { NewTopicPage } from '../pages/NewTopic'
import { Topic } from '@src/pages/Topic'
import { NewNodePage } from '@src/pages/NewNode'
import { NodePage } from '@src/pages/Node'
import { SettingsPage } from '@src/pages/Settings'
import { NotificationsPage } from '@src/pages/Notifications'
import { UserPage } from '@src/pages/User'

export const App = () => {
  return (
    <>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/settings" exact>
          <SettingsPage />
        </Route>
        <Route path="/notifications" exact>
          <NotificationsPage />
        </Route>
        <Route path="/t/:topicId" exact>
          <Topic />
        </Route>
        <Route path="/new-topic" exact>
          <NewTopicPage />
        </Route>
        <Route path="/edit-topic/:topicId" exact>
          <NewTopicPage />
        </Route>
        <Route path="/new-node" exact>
          <NewNodePage />
        </Route>
        <Route path="/go/:nodeSlug" exact>
          <NodePage />
        </Route>
        <Route path="/u/:username" exact>
          <UserPage />
        </Route>
        <Route path="/login-success" exact>
          <LoginSuccessPage />
        </Route>
        <Route path="/login" exact>
          <LoginPage />
        </Route>
      </Switch>
    </>
  )
}
