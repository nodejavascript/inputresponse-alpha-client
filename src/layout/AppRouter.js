import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import Frame from './Frame'

import Root from '../routes/Root'
import Dashboard from '../routes/Dashboard'
import About from '../routes/About'

import CardProfile from '../routes/CardProfile'
import UpdateProfile from '../routes/UpdateProfile'

import ListNeuralNetworks from '../routes/ListNeuralNetworks'
import CardNeuralNetwork from '../routes/CardNeuralNetwork'
import InsertNeuralNetwork from '../routes/InsertNeuralNetwork'
import UpdateNeuralNetwork from '../routes/UpdateNeuralNetwork'

import ListSamplingClients from '../routes/ListSamplingClients'
import CardSamplingClient from '../routes/CardSamplingClient'
import InsertSamplingClient from '../routes/InsertSamplingClient'
import UpdateSamplingClient from '../routes/UpdateSamplingClient'

import ListModelSamples from '../routes/ListModelSamples'
import CardModelSample from '../routes/CardModelSample'
import InsertModelSample from '../routes/InsertModelSample'
import UpdateModelSample from '../routes/UpdateModelSample'

// import Canvas from '../routes/Canvas'
// import Charts from '../routes/Charts'

import NoMatch from '../routes/NoMatch'

// booleans come from api later, yuk now
const profilePaths = {
  profile: true,
  updatePath: '/updateprofile',
  cardPath: '/profile',
  listPath: '/profile',
  display: {
    singular: 'Profile'
  }
}

const neutralNetworkPaths = {
  insertPath: '/insertneuralnetwork',
  listPath: '/neuralnetworks',
  cardPath: '/neuralnetwork',
  updatePath: '/updateneuralnetwork',
  display: {
    singular: 'Neural Network',
    plural: 'Neural Networks',
    info: 'Graph theory, graph analytics with your Neural Networks.'
  }
}

const samplingClientPaths = {
  insertPath: '/insertsamplingclient',
  listPath: '/samplingclients',
  cardPath: '/samplingclient',
  updatePath: '/updatesamplingclient',
  display: {
    singular: 'Sampling Client',
    plural: 'Sampling Clients',
    info: 'These may be embedded, apps, users or other AI sources for example. Clients submit payloads ({ input, output }) to any of your Neural Networks.'
  }
}

const modelSamplePaths = {
  insertPath: '/insertmodelsample',
  listPath: '/modelsamples',
  cardPath: '/modelsample',
  updatePath: '/updatemodelsample',
  display: {
    singular: 'Model Sample',
    plural: 'Model Samples',
    info: 'Client payloads used to train your Neural Network\'s Model'
  }
}

const otherRoutes = [
  {
    exact: true,
    path: '/updateprofile',
    title: 'Update Profile',
    element: <UpdateProfile paths={profilePaths} />,
    auth: true
  },

  {
    exact: true,
    path: '/neuralnetwork/:neuralnetworkId',
    title: 'Neural Network',
    element: <CardNeuralNetwork paths={neutralNetworkPaths} />,
    auth: true
  },
  {
    path: '/insertneuralnetwork',
    title: 'Insert Neural Network',
    element: <InsertNeuralNetwork paths={neutralNetworkPaths} />,
    auth: true
  },
  {
    exact: true,
    path: '/updateneuralnetwork/:neuralnetworkId',
    title: 'Update Neural Network',
    element: <UpdateNeuralNetwork paths={neutralNetworkPaths} />,
    auth: true
  },

  {
    exact: true,
    path: '/samplingclient/:samplingclientId',
    title: 'Sampling Client',
    element: <CardSamplingClient paths={samplingClientPaths} />,
    auth: true
  },
  {
    exact: true,
    path: '/insertsamplingclient',
    title: 'Insert Sampling Client',
    element: <InsertSamplingClient paths={samplingClientPaths} />,
    auth: true
  },
  {
    exact: true,
    path: '/updatesamplingclient/:samplingclientId',
    title: 'Update Sampling Client',
    element: <UpdateSamplingClient paths={samplingClientPaths} />,
    auth: true
  },

  {
    exact: true,
    path: '/modelsample/:modelsampleId',
    title: 'Model Sample',
    element: <CardModelSample paths={modelSamplePaths} />,
    auth: true
  },
  {
    exact: true,
    path: '/insertmodelsample',
    title: 'Insert Model Sample',
    element: <InsertModelSample paths={modelSamplePaths} />,
    auth: true
  },
  {
    exact: true,
    path: '/updatemodelsample/:modelsampleId',
    title: 'Update Model Sample',
    element: <UpdateModelSample paths={modelSamplePaths} />,
    auth: true
  }
]

export const navigationalRoutes = [
  {
    exact: true,
    path: '/',
    title: 'Root',
    element: <Root />
  },
  {
    exact: true,
    path: '/dashboard',
    title: 'Dashboard',
    element: <Dashboard />
  },
  {
    exact: true,
    path: '/profile',
    title: 'Profile',
    element: <CardProfile paths={profilePaths} />,
    auth: true
  },
  {
    exact: true,
    path: '/neuralnetworks',
    title: 'Neural Networks',
    element: <ListNeuralNetworks paths={neutralNetworkPaths} />,
    auth: true
  },
  {
    exact: true,
    path: '/samplingclients',
    title: 'Sampling Clients',
    element: <ListSamplingClients paths={samplingClientPaths} />,
    auth: true
  },
  {
    exact: true,
    path: '/modelsamples',
    title: 'Model Samples',
    element: <ListModelSamples paths={modelSamplePaths} />,
    auth: true
  },
  // {
  //   exact: true,
  //   path: '/canvas',
  //   title: 'Canvas',
  //   element: <Canvas />
  // },
  // {
  //   exact: true,
  //   path: '/charts',
  //   title: 'Charts',
  //   element: <Charts />
  // },
  {
    exact: true,
    path: '/about',
    title: 'About',
    element: <About />
  }
]

export const allRoutes = [...otherRoutes, ...navigationalRoutes]

export const returnCurrentRoute = pathname => {
  if (!pathname) return null
  const route = allRoutes.find(i => i.path === pathname)
  if (route) return route

  const path = pathname.split('/')[1]
  return allRoutes.find(i => i.path.includes(path))
}

const AppRouter = ({ reactiveAuthToken }) => {
  return (
    <BrowserRouter>
      <Frame returnCurrentRoute={returnCurrentRoute}>
        <Routes>
          {
            allRoutes.map(route => <Route key={`route${route.path}`} {...route} />)
          }
          <Route path='*' element=<NoMatch /> />
        </Routes>

      </Frame>
    </BrowserRouter>
  )
}

export default AppRouter